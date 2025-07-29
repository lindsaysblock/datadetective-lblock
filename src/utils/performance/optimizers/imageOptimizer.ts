/**
 * Image Optimizer
 * Focused utility for image lazy loading and optimization
 */

class ImageOptimizer {
  private lazyImages = new Set<HTMLImageElement>();

  async optimize(): Promise<number> {
    console.log('🔧 Optimizing images...');
    
    let optimizedCount = 0;

    // Enhanced intersection observer for images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImageOptimized(img);
          imageObserver.unobserve(img);
          optimizedCount++;
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Find and observe all lazy images
    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
      this.lazyImages.add(img as HTMLImageElement);
    });

    // Optimize existing images
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
        optimizedCount++;
      }
    });

    console.log(`✅ Image optimization complete - ${optimizedCount} images optimized`);
    return optimizedCount;
  }

  private loadImageOptimized(img: HTMLImageElement): void {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }

    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '0';
    
    img.onload = () => {
      img.style.opacity = '1';
    };

    img.onerror = () => {
      img.style.opacity = '0.5';
      console.warn('Failed to load image:', img.src);
    };
  }

  cleanup(): void {
    this.lazyImages.clear();
  }
}

export const imageOptimizer = new ImageOptimizer();