import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEdgeFunction } from '@/hooks/useEdgeFunctions';
import { BookOpen, Clock, Trophy, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseProgress {
  course_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  lessons_completed: number;
  total_lessons: number;
}

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instructor_name: string;
  duration_hours: number;
  level: string;
  category: string;
  price: number;
  progress?: CourseProgress;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
}

const StudentDashboard: React.FC = () => {
  const { user, profile, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0
  });

  const { execute: getEnrolledCourses, loading: coursesLoading } = useEdgeFunction(
    'course',
    'getEnrolledCourses'
  );

  const { execute: getDashboardStats, loading: statsLoading } = useEdgeFunction(
    'dashboard',
    'getStudentStats'
  );

  const { execute: getCourseProgress } = useEdgeFunction(
    'course',
    'getCourseProgress'
  );

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load enrolled courses
      const coursesResult = await getEnrolledCourses();
      if (coursesResult.data) {
        const coursesWithProgress = await Promise.all(
          coursesResult.data.map(async (course: EnrolledCourse) => {
            const progressResult = await getCourseProgress(course.id);
            return {
              ...course,
              progress: progressResult.data
            };
          })
        );
        setEnrolledCourses(coursesWithProgress);
      }

      // Load dashboard stats
      const statsResult = await getDashboardStats();
      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getProgressText = (progress: number) => {
    if (progress >= 100) return 'Completado';
    if (progress >= 75) return 'Casi terminado';
    if (progress >= 50) return 'En progreso';
    if (progress > 0) return 'Iniciado';
    return 'No iniciado';
  };

  if (coursesLoading || statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {profile?.full_name || user?.email}
        </h1>
        <p className="text-gray-600">
          Continúa tu aprendizaje y alcanza tus objetivos
        </p>
        {!hasActiveSubscription && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Tu suscripción ha expirado. 
              <Button 
                variant="link" 
                className="text-yellow-800 underline p-0 ml-1"
                onClick={() => navigate('/subscription')}
              >
                Renueva tu suscripción
              </Button> 
              para seguir accediendo a todos los cursos.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Completados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Mis Cursos</h2>
          <Button onClick={() => navigate('/courses')}>
            Explorar Más Cursos
          </Button>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes cursos inscritos
              </h3>
              <p className="text-gray-600 mb-4">
                Explora nuestro catálogo y comienza tu aprendizaje
              </p>
              <Button onClick={() => navigate('/courses')}>
                Explorar Cursos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.image_url || '/placeholder.svg'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2"
                  >
                    {course.level}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {course.instructor_name}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration_hours} horas
                  </div>

                  {course.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{Math.round(course.progress.progress)}%</span>
                      </div>
                      <Progress 
                        value={course.progress.progress} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          {course.progress.lessons_completed} de {course.progress.total_lessons} lecciones
                        </span>
                        <span className={`font-medium ${
                          course.progress.progress >= 100 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {getProgressText(course.progress.progress)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {course.progress?.progress ? 'Continuar' : 'Comenzar'}
                    </Button>
                    
                    {course.progress?.completed && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/certificate/${course.id}`)}
                      >
                        <Trophy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
