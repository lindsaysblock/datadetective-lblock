
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Edit3, Trash2, NotebookPen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectNote {
  id: string;
  dataset_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProjectNotesProps {
  datasetId?: string;
}

const ProjectNotes: React.FC<ProjectNotesProps> = ({ datasetId }) => {
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!datasetId) return;
    
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('dataset_id', datasetId)
        .eq('type', 'note')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedNotes = data.map(item => ({
        id: item.id,
        dataset_id: item.dataset_id,
        content: item.description || '',
        created_at: item.created_at,
        updated_at: item.created_at
      }));
      
      setNotes(formattedNotes);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNote = async () => {
    if (!newNote.trim() || !datasetId) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('analysis_results')
        .insert([{
          dataset_id: datasetId,
          user_id: user.id,
          type: 'note',
          title: 'Project Note',
          description: newNote.trim(),
          data: {}
        }])
        .select()
        .single();

      if (error) throw error;

      const newNoteItem = {
        id: data.id,
        dataset_id: datasetId,
        content: newNote.trim(),
        created_at: data.created_at,
        updated_at: data.created_at
      };

      setNotes(prev => [newNoteItem, ...prev]);
      setNewNote('');
      
      toast({
        title: "Note Saved",
        description: "Your project note has been saved.",
      });
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editContent.trim()) return;
    
    try {
      const { error } = await supabase
        .from('analysis_results')
        .update({ description: editContent.trim() })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, content: editContent.trim(), updated_at: new Date().toISOString() }
          : note
      ));
      
      setEditingNote(null);
      setEditContent('');
      
      toast({
        title: "Note Updated",
        description: "Your project note has been updated.",
      });
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Note Deleted",
        description: "Your project note has been deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const startEditing = (note: ProjectNote) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchNotes();
  }, [datasetId]);

  if (!datasetId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <NotebookPen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Load a dataset to start taking project notes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NotebookPen className="w-5 h-5" />
          Project Notes & Observations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add your observations, insights, or notes about this project..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={saveNote} 
            disabled={!newNote.trim() || loading}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <NotebookPen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notes yet. Add your first observation above.</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateNote(note.id)}
                          className="flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(note.created_at)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(note)}
                            className="p-1 h-auto"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNote(note.id)}
                            className="p-1 h-auto text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectNotes;
