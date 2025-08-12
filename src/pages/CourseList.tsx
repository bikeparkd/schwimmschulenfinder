
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/contexts/SupabaseContext";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import CourseCard from "@/components/CourseCard";

const CourseList = () => {
  const { t } = useLanguage();
  const { filteredCourses, filterCourses, fetchCourses } = useSupabase();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 flex flex-col lg:flex-row">
        <FilterSidebar 
          onFilterChange={filterCourses} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-medium text-gray-700">
              {filteredCourses.length} {t('found')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No courses found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseList;
