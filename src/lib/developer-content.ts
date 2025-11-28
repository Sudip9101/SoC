/**
 * Developer Content Management System
 * Manages developer documentation, downloads, and S3 file links
 */

export interface DownloadableFile {
  id: string;
  name: string;
  description: string;
  url: string;
  s3Url: string;
  size: string;
  type: 'pdf' | 'zip' | 'doc' | 'txt' | 'code';
  category: string;
}

export interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  files: DownloadableFile[];
  content: string;
  lastUpdated: string;
}

export class DeveloperContentManager {
  private static sections: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Essential guides and tutorials to get you started with SoCTeamup development',
      icon: 'Book',
      content: 'Welcome to SoCTeamup development documentation.',
      lastUpdated: '2024-01-15',
      files: [
        {
          id: 'quick-start-guide',
          name: 'Quick Start Guide',
          description: 'Step-by-step guide to set up your development environment',
          url: '/downloads/quick-start-guide.pdf',
          s3Url: '/downloads/quick-start-guide.pdf',
          size: '2.1 MB',
          type: 'pdf',
          category: 'guide'
        }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation and endpoints',
      icon: 'Code',
      content: 'Comprehensive API documentation.',
      lastUpdated: '2024-01-10',
      files: [
        {
          id: 'api-docs',
          name: 'API Documentation',
          description: 'Complete REST API reference',
          url: '/downloads/api-docs.pdf',
          s3Url: '/downloads/api-docs.pdf',
          size: '3.5 MB',
          type: 'pdf',
          category: 'reference'
        }
      ]
    }
  ];

  static getAllSections(): DocumentationSection[] {
    return this.sections;
  }

  static getSectionById(id: string): DocumentationSection | undefined {
    return this.sections.find(section => section.id === id);
  }

  static getFilesByCategory(category: string): DownloadableFile[] {
    return this.sections
      .flatMap(section => section.files)
      .filter(file => file.category === category);
  }

  static trackDownload(fileId: string): void {
    // Track download for analytics
  }
}

export const developerContent = {
  sections: DeveloperContentManager.getAllSections(),
  manager: DeveloperContentManager
}; 