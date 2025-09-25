import { supabase, isSupabaseConfigured } from './supabase.js';

// Sample fallback data for when Supabase is not configured
const fallbackData = [
  {
    id: '1',
    name: '100 Python Interview Questions',
    file_link: 'https://drive.google.com/file/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV/view?usp=sharing',
    thumbnail: 'https://lh3.googleusercontent.com/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV=s1024?authuser=0',
    created_at: '2024-01-15T10:00:00Z',
    category: 'Placement Material',
    subcategory: 'C & DSA Notes'
  },
  {
    id: '2',
    name: 'C Code for Raspberry Pi (92 pages)',
    file_link: 'https://drive.google.com/file/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_/view?usp=sharing',
    thumbnail: 'https://lh3.googleusercontent.com/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_=s1024?authuser=0',
    created_at: '2024-01-12T15:30:00Z',
    category: 'Placement Material',
    subcategory: 'C & DSA Notes'
  },
  {
    id: '3',
    name: 'Word Power Made Easy by Norman Lewis',
    file_link: 'https://drive.google.com/file/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg/view?usp=sharing',
    thumbnail: 'https://lh3.googleusercontent.com/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg=s1024?authuser=0',
    created_at: '2024-01-10T09:15:00Z',
    category: 'Placement Material',
    subcategory: 'English'
  }
];

// Service for managing PDF resources in Supabase
export class PDFDataService {
  // Get all categories with their resources
  static async getAllCategoriesWithResources() {
    try {
      const { data, error } = await supabase
        .from('pdf_categories')
        .select(`
          *,
          pdf_resources (
            id,
            name,
            file_link,
            thumbnail,
            created_at
          )
        `);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories with resources:', error);
      return [];
    }
  }

  // Get all PDF resources with optional filtering
  static async getAllResources(filters = {}) {
    try {
      let query = supabase
        .from('pdf_library_view')
        .select('*');

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.subcategory && filters.subcategory !== 'all') {
        query = query.eq('subcategory', filters.subcategory);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'title':
            query = query.order('name', { ascending: true });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching resources:', error);
      
      // If Supabase is not configured, return fallback data
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback data');
        let filteredData = [...fallbackData];
        
        // Apply search filter
        if (filters.search) {
          filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        // Apply category filter
        if (filters.category && filters.category !== 'all') {
          filteredData = filteredData.filter(item => 
            item.category === filters.category
          );
        }
        
        // Apply subcategory filter
        if (filters.subcategory && filters.subcategory !== 'all') {
          filteredData = filteredData.filter(item => 
            item.subcategory === filters.subcategory
          );
        }
        
        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'newest':
              filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              break;
            case 'title':
              filteredData.sort((a, b) => a.name.localeCompare(b.name));
              break;
            default:
              filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          }
        }
        
        return filteredData;
      }
      
      return [];
    }
  }

  // Get a single PDF resource by ID
  static async getResourceById(id) {
    // If Supabase is not configured, return from fallback data
    if (!isSupabaseConfigured()) {
      return fallbackData.find(item => item.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('pdf_library_view')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching resource by ID:', error);
      // Return from fallback data on error
      return fallbackData.find(item => item.id === id) || null;
    }
  }

  // Get all unique categories
  static async getAllCategories() {
    // If Supabase is not configured, return fallback categories
    if (!isSupabaseConfigured()) {
      const categories = [...new Set(fallbackData.map(item => item.category))];
      const subcategories = [...new Set(fallbackData.map(item => item.subcategory))];
      // Create unique combinations of category and subcategory
      const uniqueCombinations = [];
      fallbackData.forEach(item => {
        const exists = uniqueCombinations.some(combo => 
          combo.category === item.category && combo.subcategory === item.subcategory
        );
        if (!exists) {
          uniqueCombinations.push({ category: item.category, subcategory: item.subcategory });
        }
      });
      return uniqueCombinations;
    }

    try {
      const { data, error } = await supabase
        .from('pdf_categories')
        .select('category, subcategory')
        .order('category');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return fallback categories on error
      const categories = [...new Set(fallbackData.map(item => item.category))];
      const subcategories = [...new Set(fallbackData.map(item => item.subcategory))];
      // Create unique combinations of category and subcategory
      const uniqueCombinations = [];
      fallbackData.forEach(item => {
        const exists = uniqueCombinations.some(combo => 
          combo.category === item.category && combo.subcategory === item.subcategory
        );
        if (!exists) {
          uniqueCombinations.push({ category: item.category, subcategory: item.subcategory });
        }
      });
      return uniqueCombinations;
    }
  }

  // Update download count for a resource (no longer needed, but keeping for compatibility)
  static async incrementDownloadCount(resourceId) {
    // This function is no longer needed since downloads column is removed
    // Keeping it to avoid breaking existing code that calls it
    console.log('Download count tracking disabled - downloads column removed');
    return true;
  }

  // Add a new PDF resource
  static async addResource(resource, categoryId) {
    try {
      const { data, error } = await supabase
        .from('pdf_resources')
        .insert({
          ...resource,
          category_id: categoryId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding resource:', error);
      return null;
    }
  }

  // Bulk insert resources from JSON data
  static async bulkInsertFromJSON(jsonData) {
    try {
      const results = [];
      
      for (const categoryData of jsonData) {
        // First, create or get the category
        const { data: categoryResult, error: categoryError } = await supabase
          .from('pdf_categories')
          .upsert({
            category: categoryData.category,
            subcategory: categoryData.subcategory
          }, {
            onConflict: 'category,subcategory'
          })
          .select()
          .single();

        if (categoryError) {
          console.error('Error creating category:', categoryError);
          continue;
        }

        // Then insert all resources for this category
        const resources = categoryData.resources.map(resource => ({
          ...resource,
          category_id: categoryResult.id,
          created_at: new Date().toISOString()
        }));

        const { data: resourcesResult, error: resourcesError } = await supabase
          .from('pdf_resources')
          .insert(resources)
          .select();

        if (resourcesError) {
          console.error('Error inserting resources:', resourcesError);
        } else {
          results.push(...resourcesResult);
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk inserting data:', error);
      return [];
    }
  }

  // Helper function to generate tags from resource name (removed - no longer needed)
  static generateTagsFromName(name) {
    // This function is no longer needed since tags column is removed
    return [];
  }
}

export default PDFDataService;