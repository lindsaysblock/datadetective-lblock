
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Table, Eye, EyeOff } from 'lucide-react';

interface VisualQueryBuilderProps {
  onQueryChange: (query: string) => void;
  showExplanation: boolean;
}

interface TableField {
  name: string;
  type: string;
  table: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector: 'AND' | 'OR';
}

const VisualQueryBuilder: React.FC<VisualQueryBuilderProps> = ({
  onQueryChange,
  showExplanation
}) => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderDirection, setOrderDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [limit, setLimit] = useState<string>('');

  // Mock data - in real app, this would come from connected data sources
  const availableTables = [
    { name: 'customers', label: 'Customers' },
    { name: 'orders', label: 'Orders' },
    { name: 'products', label: 'Products' },
    { name: 'order_items', label: 'Order Items' }
  ];

  const tableFields: Record<string, TableField[]> = {
    customers: [
      { name: 'id', type: 'number', table: 'customers' },
      { name: 'name', type: 'text', table: 'customers' },
      { name: 'email', type: 'text', table: 'customers' },
      { name: 'created_at', type: 'date', table: 'customers' }
    ],
    orders: [
      { name: 'id', type: 'number', table: 'orders' },
      { name: 'customer_id', type: 'number', table: 'orders' },
      { name: 'total', type: 'number', table: 'orders' },
      { name: 'status', type: 'text', table: 'orders' },
      { name: 'order_date', type: 'date', table: 'orders' }
    ],
    products: [
      { name: 'id', type: 'number', table: 'products' },
      { name: 'name', type: 'text', table: 'products' },
      { name: 'price', type: 'number', table: 'products' },
      { name: 'category', type: 'text', table: 'products' }
    ],
    order_items: [
      { name: 'id', type: 'number', table: 'order_items' },
      { name: 'order_id', type: 'number', table: 'order_items' },
      { name: 'product_id', type: 'number', table: 'order_items' },
      { name: 'quantity', type: 'number', table: 'order_items' }
    ]
  };

  const operators = [
    { value: '=', label: 'equals' },
    { value: '!=', label: 'not equals' },
    { value: '>', label: 'greater than' },
    { value: '<', label: 'less than' },
    { value: '>=', label: 'greater than or equal' },
    { value: '<=', label: 'less than or equal' },
    { value: 'LIKE', label: 'contains' },
    { value: 'IN', label: 'in list' }
  ];

  const getAllFields = () => {
    const fields: TableField[] = [];
    selectedTables.forEach(table => {
      if (tableFields[table]) {
        fields.push(...tableFields[table]);
      }
    });
    return fields;
  };

  const generateQuery = () => {
    if (selectedTables.length === 0) return '';

    let query = 'SELECT ';
    
    // Fields
    if (selectedFields.length === 0) {
      query += '*';
    } else {
      query += selectedFields.join(', ');
    }

    // FROM clause
    query += `\nFROM ${selectedTables[0]}`;

    // JOINs (simplified - assumes foreign key relationships)
    if (selectedTables.length > 1) {
      for (let i = 1; i < selectedTables.length; i++) {
        const table = selectedTables[i];
        query += `\nJOIN ${table} ON `;
        
        // Simple join logic based on common patterns
        if (table === 'orders' && selectedTables.includes('customers')) {
          query += 'customers.id = orders.customer_id';
        } else if (table === 'order_items' && selectedTables.includes('orders')) {
          query += 'orders.id = order_items.order_id';
        } else if (table === 'products' && selectedTables.includes('order_items')) {
          query += 'products.id = order_items.product_id';
        } else {
          query += `${selectedTables[0]}.id = ${table}.${selectedTables[0]}_id`;
        }
      }
    }

    // WHERE clause
    if (conditions.length > 0) {
      query += '\nWHERE ';
      conditions.forEach((condition, index) => {
        if (index > 0) {
          query += ` ${condition.connector} `;
        }
        query += `${condition.field} ${condition.operator} `;
        
        if (condition.operator === 'LIKE') {
          query += `'%${condition.value}%'`;
        } else if (condition.operator === 'IN') {
          query += `(${condition.value})`;
        } else if (isNaN(Number(condition.value))) {
          query += `'${condition.value}'`;
        } else {
          query += condition.value;
        }
      });
    }

    // ORDER BY
    if (orderBy) {
      query += `\nORDER BY ${orderBy} ${orderDirection}`;
    }

    // LIMIT
    if (limit) {
      query += `\nLIMIT ${limit}`;
    }

    return query;
  };

  useEffect(() => {
    const query = generateQuery();
    onQueryChange(query);
  }, [selectedTables, selectedFields, conditions, orderBy, orderDirection, limit]);

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: '=',
      value: '',
      connector: 'AND'
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Table Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            <h3 className="text-lg font-semibold">1. Select Tables</h3>
            {showExplanation && <Badge variant="outline">Choose your data sources</Badge>}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableTables.map(table => (
              <div key={table.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={table.name}
                  checked={selectedTables.includes(table.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTables([...selectedTables, table.name]);
                    } else {
                      setSelectedTables(selectedTables.filter(t => t !== table.name));
                      // Clear fields from removed table
                      setSelectedFields(selectedFields.filter(field => {
                        const [tableName] = field.split('.');
                        return tableName !== table.name;
                      }));
                    }
                  }}
                  className="rounded"
                />
                <Label htmlFor={table.name} className="text-sm">{table.label}</Label>
              </div>
            ))}
          </div>

          {showExplanation && selectedTables.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              💡 You selected {selectedTables.length} table(s). When multiple tables are selected, 
              the system automatically creates JOIN relationships based on common foreign key patterns.
            </div>
          )}
        </div>
      </Card>

      {/* Field Selection */}
      {selectedTables.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <h3 className="text-lg font-semibold">2. Select Fields</h3>
              {showExplanation && <Badge variant="outline">Choose columns to display</Badge>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getAllFields().map(field => {
                const fieldName = `${field.table}.${field.name}`;
                return (
                  <div key={fieldName} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={fieldName}
                      checked={selectedFields.includes(fieldName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields([...selectedFields, fieldName]);
                        } else {
                          setSelectedFields(selectedFields.filter(f => f !== fieldName));
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={fieldName} className="text-sm">
                      {field.table}.{field.name}
                      <Badge variant="secondary" className="ml-1 text-xs">{field.type}</Badge>
                    </Label>
                  </div>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                💡 Leave all fields unchecked to select all columns (*). 
                Selecting specific fields improves query performance and reduces data transfer.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Conditions */}
      {selectedTables.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">3. Add Conditions (WHERE)</h3>
                {showExplanation && <Badge variant="outline">Filter your data</Badge>}
              </div>
              <Button onClick={addCondition} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>

            {conditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {index > 0 && (
                  <Select
                    value={condition.connector}
                    onValueChange={(value: 'AND' | 'OR') => updateCondition(condition.id, { connector: value })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={condition.field}
                  onValueChange={(value) => updateCondition(condition.id, { field: value })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllFields().map(field => (
                      <SelectItem key={`${field.table}.${field.name}`} value={`${field.table}.${field.name}`}>
                        {field.table}.{field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(op => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                  className="flex-1"
                />

                <Button
                  onClick={() => removeCondition(condition.id)}
                  size="sm"
                  variant="outline"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {showExplanation && conditions.length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                💡 Conditions filter your results. Use AND when all conditions must be true, 
                use OR when any condition can be true.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Sorting and Limiting */}
      {selectedTables.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">4. Sort & Limit (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Order By</Label>
                <Select value={orderBy} onValueChange={setOrderBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field to sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No sorting</SelectItem>
                    {getAllFields().map(field => (
                      <SelectItem key={`${field.table}.${field.name}`} value={`${field.table}.${field.name}`}>
                        {field.table}.{field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={orderDirection} onValueChange={(value: 'ASC' | 'DESC') => setOrderDirection(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASC">Ascending (A-Z, 1-9)</SelectItem>
                    <SelectItem value="DESC">Descending (Z-A, 9-1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Limit Results</Label>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VisualQueryBuilder;
