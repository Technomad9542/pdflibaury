import { supabase } from './supabase.js';

// Admin service for managing PDF library data
export class AdminDataService {
  
  // Check if user is admin
  static async isUserAdmin(userEmail) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
  
  // Add a new PDF with automatic category creation
  static async addNewPDF(pdfData) {
    try {
      const { category, subcategory, name, file_link, thumbnail } = pdfData;
      
      // Step 1: Create or get category
      let categoryRecord = await this.getOrCreateCategory(category, subcategory);
      
      // Step 2: Generate Google Drive thumbnail if not provided
      const finalThumbnail = thumbnail || this.generateGoogleDriveThumbnail(file_link);
      
      // Step 3: Insert the PDF resource
      const { data: resource, error: resourceError } = await supabase
        .from('pdf_resources')
        .insert({
          category_id: categoryRecord.id,
          name,
          file_link,
          thumbnail: finalThumbnail
        })
        .select()
        .single();

      if (resourceError) throw resourceError;
      
      console.log('✅ PDF added successfully:', resource.name);
      return resource;
      
    } catch (error) {
      console.error('❌ Error adding PDF:', error);
      throw error;
    }
  }

  // Get or create a category
  static async getOrCreateCategory(category, subcategory) {
    try {
      // First, try to find existing category
      const { data: existing, error: findError } = await supabase
        .from('pdf_categories')
        .select('*')
        .eq('category', category)
        .eq('subcategory', subcategory)
        .single();

      if (existing && !findError) {
        return existing;
      }

      // Create new category if it doesn't exist
      const { data: newCategory, error: createError } = await supabase
        .from('pdf_categories')
        .insert({
          category,
          subcategory
        })
        .select()
        .single();

      if (createError) throw createError;
      
      console.log('✅ New category created:', `${category} > ${subcategory}`);
      return newCategory;
      
    } catch (error) {
      console.error('❌ Error handling category:', error);
      throw error;
    }
  }

  // Generate Google Drive thumbnail URL from file link
  static generateGoogleDriveThumbnail(fileLink) {
    const fileIdMatch = fileLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}=s1024?authuser=0`;
    }
    return null;
  }

  // Bulk add multiple PDFs
  static async bulkAddPDFs(pdfArray) {
    const results = [];
    const errors = [];
    
    for (const pdf of pdfArray) {
      try {
        const result = await this.addNewPDF(pdf);
        results.push(result);
      } catch (error) {
        errors.push({ pdf: pdf.name, error: error.message });
      }
    }
    
    return { 
      success: results.length, 
      failed: errors.length, 
      results, 
      errors 
    };
  }

  // Get all categories with resource counts
  static async getCategoriesWithCounts() {
    try {
      const { data, error } = await supabase
        .from('pdf_categories')
        .select(`
          *,
          pdf_resources (count)
        `);

      if (error) throw error;
      return data.map(cat => ({
        ...cat,
        resource_count: cat.pdf_resources?.[0]?.count || 0
      }));
    } catch (error) {
      console.error('❌ Error fetching categories with counts:', error);
      return [];
    }
  }

  // Update PDF metadata
  static async updatePDF(id, updates) {
    try {
      const { data, error } = await supabase
        .from('pdf_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ PDF updated successfully:', data.name);
      return data;
    } catch (error) {
      console.error('❌ Error updating PDF:', error);
      throw error;
    }
  }

  // Delete a PDF
  static async deletePDF(id) {
    try {
      const { error } = await supabase
        .from('pdf_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('✅ PDF deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting PDF:', error);
      throw error;
    }
  }

  // Get database statistics
  static async getStats() {
    try {
      const [categoriesResult, resourcesResult] = await Promise.all([
        supabase.from('pdf_categories').select('id', { count: 'exact' }),
        supabase.from('pdf_resources').select('id', { count: 'exact' })
      ]);

      return {
        totalCategories: categoriesResult.count || 0,
        totalResources: resourcesResult.count || 0
      };
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return { totalCategories: 0, totalResources: 0 };
    }
  }
}

export default AdminDataService;