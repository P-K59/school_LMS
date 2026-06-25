"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // Index of correct option (0-3)
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  defaultPrice: number;
  modules: Module[];
  quizzes: Quiz[];
}

export interface School {
  id: string;
  name: string;
  logo: string; // Initials or key
  adminName: string;
  adminEmail: string;
  plan: "Base" | "Pro" | "Enterprise";
  startDate: string;
  expiryDate: string;
  renewalStatus: "Auto-Renew" | "Manual" | "Expired";
  status: "Active" | "Suspended";
  studentCount: number;
  coursesCount: number;
  monthlyRevenue: number;
}

export interface PricingCustomization {
  id: string;
  schoolId: string;
  courseId: string;
  customPrice: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetSchoolId: string; // schoolId or "all"
  date: string;
  status: "Published" | "Draft";
}

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  category: "Onboarding" | "Finance" | "Compliance" | "System";
}

interface MockDataContextType {
  schools: School[];
  courses: Course[];
  pricingCustomizations: PricingCustomization[];
  announcements: Announcement[];
  activities: Activity[];
  addSchool: (school: Omit<School, "id" | "coursesCount" | "monthlyRevenue">) => void;
  updateSchool: (school: School) => void;
  toggleSchoolStatus: (schoolId: string) => void;
  addCourse: (course: Omit<Course, "id">) => void;
  updateCourse: (course: Course) => void;
  setCustomPricing: (schoolId: string, courseId: string, price: number) => void;
  removeCustomPricing: (schoolId: string, courseId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, "id" | "date">) => void;
  deleteAnnouncement: (id: string) => void;
  addActivity: (text: string, category: Activity["category"]) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const initialSchools: School[] = [
  {
    id: "edu-1",
    name: "Oakwood Academy",
    logo: "OA",
    adminName: "Sarah Jenkins",
    adminEmail: "s.jenkins@oakwood.edu",
    plan: "Enterprise",
    startDate: "2026-01-15",
    expiryDate: "2026-12-15",
    renewalStatus: "Auto-Renew",
    status: "Active",
    studentCount: 1200,
    coursesCount: 8,
    monthlyRevenue: 4200,
  },
  {
    id: "edu-2",
    name: "Crescent International",
    logo: "CI",
    adminName: "Michael Chang",
    adminEmail: "m.chang@crescent.edu",
    plan: "Pro",
    startDate: "2026-02-10",
    expiryDate: "2026-10-10",
    renewalStatus: "Auto-Renew",
    status: "Active",
    studentCount: 850,
    coursesCount: 5,
    monthlyRevenue: 1800,
  },
  {
    id: "edu-3",
    name: "Summit Science",
    logo: "SS",
    adminName: "David Miller",
    adminEmail: "d.miller@summitscience.org",
    plan: "Pro",
    startDate: "2026-03-01",
    expiryDate: "2026-07-02", // Expiring soon!
    renewalStatus: "Manual",
    status: "Active",
    studentCount: 450,
    coursesCount: 3,
    monthlyRevenue: 1450,
  },
  {
    id: "edu-4",
    name: "Riverside Arts Academy",
    logo: "RA",
    adminName: "Elena Rostova",
    adminEmail: "admin@riversidearts.org",
    plan: "Base",
    startDate: "2025-06-01",
    expiryDate: "2026-06-05", // Expired/Suspended
    renewalStatus: "Manual",
    status: "Suspended",
    studentCount: 200,
    coursesCount: 2,
    monthlyRevenue: 600,
  },
];

const initialCourses: Course[] = [
  {
    id: "course-1",
    title: "Python Essentials & Data Science",
    description: "Learn the fundamentals of Python programming and data analysis libraries.",
    category: "Computer Science",
    defaultPrice: 499,
    modules: [
      {
        id: "m1",
        title: "Introduction to Python syntax",
        lessons: [
          { id: "l1", title: "Variables & Data Types", duration: "12 mins" },
          { id: "l2", title: "Control Flow & Loops", duration: "18 mins" },
        ],
      },
      {
        id: "m2",
        title: "Working with Data Structures",
        lessons: [
          { id: "l3", title: "Lists, Tuples, and Dictionaries", duration: "15 mins" },
        ],
      },
    ],
    quizzes: [
      {
        id: "q1",
        title: "Python Syntax Basics Quiz",
        questions: [
          {
            id: "q_q1",
            question: "Which of the following is a mutable data type in Python?",
            options: ["String", "Tuple", "List", "Integer"],
            answer: 2,
          },
          {
            id: "q_q2",
            question: "How do you start a comment in Python?",
            options: ["//", "/*", "#", "<!--"],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "Modern Physics: Quantum Mechanics",
    description: "Explore the counter-intuitive and beautiful world of atomic and subatomic particles.",
    category: "Science",
    defaultPrice: 699,
    modules: [
      {
        id: "m3",
        title: "Wave-Particle Duality",
        lessons: [
          { id: "l4", title: "The Photoelectric Effect", duration: "22 mins" },
          { id: "l5", title: "De Broglie Wavelength", duration: "14 mins" },
        ],
      },
    ],
    quizzes: [],
  },
  {
    id: "course-3",
    title: "Vibrant UI/UX & Interaction Design",
    description: "A complete guide to modern interface creation, typography, and interactive mockups.",
    category: "Design",
    defaultPrice: 599,
    modules: [
      {
        id: "m4",
        title: "Principles of Visual Hierarchy",
        lessons: [
          { id: "l6", title: "Using the 8px Grid System", duration: "10 mins" },
          { id: "l7", title: "Mastering HSL Colors", duration: "16 mins" },
        ],
      },
    ],
    quizzes: [],
  },
];

const initialPricingCustomizations: PricingCustomization[] = [
  {
    id: "pc-1",
    schoolId: "edu-1",
    courseId: "course-1",
    customPrice: 399,
  },
  {
    id: "pc-2",
    schoolId: "edu-2",
    courseId: "course-1",
    customPrice: 599,
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "System Maintenance & Backup Routine",
    content: "EduVerse platform will undergo standard systems optimization and database backup. Anticipate 10 minutes of read-only access.",
    targetSchoolId: "all",
    date: "2026-06-24",
    status: "Published",
  },
  {
    id: "ann-2",
    title: "Compliance Guidelines Audit Q3",
    content: "All Registered Institutions must confirm compliance audit declarations inside their school panels by the end of next month.",
    targetSchoolId: "edu-1",
    date: "2026-06-25",
    status: "Published",
  },
];

const initialActivities: Activity[] = [
  {
    id: "act-1",
    text: "Oakwood Academy just completed onboarding for 1,200 new students.",
    timestamp: "2 hours ago",
    category: "Onboarding",
  },
  {
    id: "act-2",
    text: "Crescent Int. updated their billing cycle to Annual Pro Plan.",
    timestamp: "5 hours ago",
    category: "Finance",
  },
  {
    id: "act-3",
    text: "Course Audit for 'Modern Physics' successfully passed verification.",
    timestamp: "Yesterday",
    category: "Compliance",
  },
];

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pricingCustomizations, setPricingCustomizations] = useState<PricingCustomization[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const storedSchools = localStorage.getItem("eduverse_schools");
    const storedCourses = localStorage.getItem("eduverse_courses");
    const storedCustomPricing = localStorage.getItem("eduverse_pricing");
    const storedAnnouncements = localStorage.getItem("eduverse_announcements");
    const storedActivities = localStorage.getItem("eduverse_activities");

    if (storedSchools) setSchools(JSON.parse(storedSchools));
    else setSchools(initialSchools);

    if (storedCourses) setCourses(JSON.parse(storedCourses));
    else setCourses(initialCourses);

    if (storedCustomPricing) setPricingCustomizations(JSON.parse(storedCustomPricing));
    else setPricingCustomizations(initialPricingCustomizations);

    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    else setAnnouncements(initialAnnouncements);

    if (storedActivities) setActivities(JSON.parse(storedActivities));
    else setActivities(initialActivities);

    setInitialized(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("eduverse_schools", JSON.stringify(schools));
  }, [schools, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("eduverse_courses", JSON.stringify(courses));
  }, [courses, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("eduverse_pricing", JSON.stringify(pricingCustomizations));
  }, [pricingCustomizations, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("eduverse_announcements", JSON.stringify(announcements));
  }, [announcements, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("eduverse_activities", JSON.stringify(activities));
  }, [activities, initialized]);

  const addSchool = (schoolData: Omit<School, "id" | "coursesCount" | "monthlyRevenue">) => {
    const revenueMap = { Base: 600, Pro: 1450, Enterprise: 4200 };
    const newSchool: School = {
      ...schoolData,
      id: `edu-${Date.now()}`,
      coursesCount: 3,
      monthlyRevenue: revenueMap[schoolData.plan] || 1000,
    };
    setSchools((prev) => [newSchool, ...prev]);
    addActivity(`Onboarded new school: ${schoolData.name}`, "Onboarding");
  };

  const updateSchool = (updated: School) => {
    setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addActivity(`Updated parameters for school: ${updated.name}`, "System");
  };

  const toggleSchoolStatus = (schoolId: string) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === schoolId) {
          const newStatus = s.status === "Active" ? "Suspended" : "Active";
          addActivity(`${s.name} has been ${newStatus.toLowerCase()}.`, "Compliance");
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const addCourse = (courseData: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
    };
    setCourses((prev) => [...prev, newCourse]);
    addActivity(`Published platform-wide course: ${courseData.title}`, "System");
  };

  const updateCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const setCustomPricing = (schoolId: string, courseId: string, price: number) => {
    setPricingCustomizations((prev) => {
      const filtered = prev.filter((p) => !(p.schoolId === schoolId && p.courseId === courseId));
      const school = schools.find((s) => s.id === schoolId);
      const course = courses.find((c) => c.id === courseId);
      
      if (school && course) {
        addActivity(`Custom price of ₹${price} set for ${course.title} at ${school.name}`, "Finance");
      }
      
      return [
        ...filtered,
        {
          id: `pc-${Date.now()}`,
          schoolId,
          courseId,
          customPrice: price,
        },
      ];
    });
  };

  const removeCustomPricing = (schoolId: string, courseId: string) => {
    setPricingCustomizations((prev) =>
      prev.filter((p) => !(p.schoolId === schoolId && p.courseId === courseId))
    );
    const school = schools.find((s) => s.id === schoolId);
    const course = courses.find((c) => c.id === courseId);
    if (school && course) {
      addActivity(`Restored default pricing for ${course.title} at ${school.name}`, "Finance");
    }
  };

  const addAnnouncement = (annData: Omit<Announcement, "id" | "date">) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addActivity(`Created platform announcement: ${annData.title}`, "System");
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addActivity = (text: string, category: Activity["category"]) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      text,
      timestamp: "Just now",
      category,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]); // Keep last 20
  };

  return (
    <MockDataContext.Provider
      value={{
        schools,
        courses,
        pricingCustomizations,
        announcements,
        activities,
        addSchool,
        updateSchool,
        toggleSchoolStatus,
        addCourse,
        updateCourse,
        setCustomPricing,
        removeCustomPricing,
        addAnnouncement,
        deleteAnnouncement,
        addActivity,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
