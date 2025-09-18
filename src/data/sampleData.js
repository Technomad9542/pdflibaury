import PDFDataService from '../utils/pdfDataService.js';

// Your sample JSON data
const sampleData = [
  {
    category: "Placement Material",
    subcategory: "C & DSA Notes",
    resources: [
      {
        name: "100 Python Interview Questions",
        file_link: "https://drive.google.com/file/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV=s1024?authuser=0",
        description: "Comprehensive collection of Python interview questions with detailed answers and explanations."
      },
      {
        name: "C Code for Raspberry Pi (92 pages)",
        file_link: "https://drive.google.com/file/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_=s1024?authuser=0",
        description: "Complete guide to C programming for Raspberry Pi development with practical examples."
      }
    ]
  },
  {
    category: "Placement Material",
    subcategory: "English",
    resources: [
      {
        name: "Word Power Made Easy by Norman Lewis",
        file_link: "https://drive.google.com/file/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg=s1024?authuser=0",
        description: "The complete vocabulary builder that will enhance your English communication skills."
      }
    ]
  },
  // Add more sample data for demonstration
  {
    category: "Computer Science",
    subcategory: "Web Development",
    resources: [
      {
        name: "Modern JavaScript Handbook",
        file_link: "https://drive.google.com/file/d/sample1/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/sample1=s1024?authuser=0",
        description: "Complete guide to modern JavaScript ES6+ features and best practices."
      },
      {
        name: "React.js Complete Tutorial",
        file_link: "https://drive.google.com/file/d/sample2/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/sample2=s1024?authuser=0",
        description: "Master React.js from basics to advanced concepts with real-world projects."
      }
    ]
  },
  {
    category: "Mathematics",
    subcategory: "Calculus",
    resources: [
      {
        name: "Calculus Early Transcendentals",
        file_link: "https://drive.google.com/file/d/sample3/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/sample3=s1024?authuser=0",
        description: "Comprehensive calculus textbook covering differential and integral calculus."
      }
    ]
  },
  {
    category: "Physics",
    subcategory: "Quantum Mechanics",
    resources: [
      {
        name: "Introduction to Quantum Mechanics",
        file_link: "https://drive.google.com/file/d/sample4/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/sample4=s1024?authuser=0",
        description: "Fundamental concepts of quantum mechanics with mathematical foundations."
      }
    ]
  },
  {
    category: "Business",
    subcategory: "Marketing",
    resources: [
      {
        name: "Digital Marketing Strategy Guide",
        file_link: "https://drive.google.com/file/d/sample5/view?usp=sharing",
        thumbnail: "https://lh3.googleusercontent.com/d/sample5=s1024?authuser=0",
        description: "Complete guide to digital marketing strategies in the modern age."
      }
    ]
  }
];

// Function to insert sample data into Supabase
export const insertSampleData = async () => {
  try {
    console.log('Starting data insertion...');
    const results = await PDFDataService.bulkInsertFromJSON(sampleData);
    console.log('Data insertion completed:', results.length, 'resources inserted');
    return results;
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
};

// Function to call from browser console or component
window.insertSampleData = insertSampleData;

export default sampleData;