import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useEdgeFunction, useCreateCourse, useUpdateCourse, useDeleteCourse,
  useCreateUser, useUpdateUser, useDeleteUser 
} from '@/hooks/useEdgeFunctions';
import { 
  Users, BookOpen, DollarSign, TrendingUp,
  Edit, Trash2
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

type UserRole = 'student' | 'instructor' | 'admin';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  last_sign_in: string;
  subscription_status: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  category: string;
  level: string;
  price: number;
  students_count: number;
  published: boolean;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
  coursesPublishedThisMonth: number;
}

const AdminDashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    newUsersThisMonth: 0,
    coursesPublishedThisMonth: 0
  });

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    instructor_id: '',
    published: false
  });

  // User form state
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    role: 'student' as UserRole,
    password: ''
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { execute: getAdminStats } = useEdgeFunction('admin', 'getAdminStats');
  const { execute: getAllUsers } = useEdgeFunction('admin', 'getAllUsers');
  const { execute: getAllCourses } = useEdgeFunction('admin', 'getAllCourses');

  const { execute: createCourse, loading: createCourseLoading } = useCreateCourse({
    onSuccess: () => {
      resetCourseForm();
      loadCourses();
    }
  });

  const { execute: updateCourse, loading: updateCourseLoading } = useUpdateCourse({
    onSuccess: () => {
      resetCourseForm();
      setEditingCourse(null);
      loadCourses();
    }
  });

  const { execute: deleteCourse, loading: deleteCourseLoading } = useDeleteCourse({
    onSuccess: () => {
      loadCourses();
    }
  });

  const { execute: createUser, loading: createUserLoading } = useCreateUser({
    onSuccess: () => {
      resetUserForm();
      loadUsers();
    }
  });

  const { execute: updateUser, loading: updateUserLoading } = useUpdateUser({
    onSuccess: () => {
      resetUserForm();
      setEditingUser(null);
      loadUsers();
    }
  });

  const { execute: deleteUser, loading: deleteUserLoading } = useDeleteUser({
    onSuccess: () => {
      loadUsers();
    }
  });

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadDashboardData();
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadDashboardData = async () => {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadCourses()
    ]);
  };

  const loadStats = async () => {
    try {
      const result = await getAdminStats();
      if (result.data) {
        setStats(result.data);
      } else {
        // Mock data
        setStats({
          totalUsers: 1547,
          totalCourses: 23,
          totalRevenue: 45230,
          activeSubscriptions: 892,
          newUsersThisMonth: 156,
          coursesPublishedThisMonth: 3
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await getAllUsers();
      if (result.data) {
        setUsers(result.data);
      } else {
        // Mock data
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'ana.garcia@email.com',
            full_name: 'Ana García',
            role: 'instructor',
            created_at: '2024-01-15T00:00:00Z',
            last_sign_in: '2024-01-20T10:30:00Z',
            subscription_status: true
          },
          {
            id: '2',
            email: 'carlos.lopez@email.com',
            full_name: 'Carlos López',
            role: 'student',
            created_at: '2024-01-10T00:00:00Z',
            last_sign_in: '2024-01-19T15:45:00Z',
            subscription_status: true
          }
        ];
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const result = await getAllCourses();
      if (result.data) {
        setCourses(result.data);
      } else {
        // Mock data
        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'Desarrollo Web Full Stack',
            description: 'Aprende React, Node.js y MongoDB desde cero',
            instructor_name: 'Ana García',
            category: 'Desarrollo Web',
            level: 'intermediate',
            price: 99,
            students_count: 234,
            published: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            title: 'Python para Data Science',
            description: 'Domina Python y análisis de datos',
            instructor_name: 'Carlos Mendoza',
            category: 'Data Science',
            level: 'advanced',
            price: 129,
            students_count: 156,
            published: false,
            created_at: '2024-01-05T00:00:00Z'
          }
        ];
        setCourses(mockCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      price: 0,
      instructor_id: '',
      published: false
    });
  };

  const resetUserForm = () => {
    setUserForm({
      email: '',
      full_name: '',
      role: 'student',
      password: ''
    });
  };

  const handleCreateCourse = async () => {
    await createCourse(courseForm);
  };

  const handleUpdateCourse = async () => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, courseForm);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      await deleteCourse(courseId);
    }
  };

  const handleCreateUser = async () => {
    await createUser(userForm);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      await updateUser(editingUser.id, userForm);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await deleteUser(userId);
    }
  };

  const startEditingCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      instructor_id: '', // Would be populated from course data
      published: course.published
    });
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      password: ''
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona usuarios, cursos y el contenido de la plataforma</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersThisMonth} este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.coursesPublishedThisMonth} publicados este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Revenue total acumulado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  Usuarios con suscripción activa
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cursos Recientes</CardTitle>
                <CardDescription>Últimos cursos creados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.instructor_name}</p>
                      </div>
                      <Badge className={course.published ? '' : 'bg-yellow-100 text-yellow-800'}>
                        {course.published ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
                <CardDescription>Últimos usuarios registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {/* Course Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title">Título</Label>
                  <Input
                    id="course-title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="Título del curso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-category">Categoría</Label>
                  <Input
                    id="course-category"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    placeholder="Categoría del curso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-level">Nivel</Label>
                  <Select
                    value={courseForm.level}
                    onValueChange={(value) => setCourseForm({ ...courseForm, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-price">Precio</Label>
                  <Input
                    id="course-price"
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="course-description">Descripción</Label>
                  <Textarea
                    id="course-description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Descripción del curso"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <Button
                  onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                  disabled={createCourseLoading || updateCourseLoading}
                >
                  {editingCourse ? 'Actualizar Curso' : 'Crear Curso'}
                </Button>
                {editingCourse && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCourse(null);
                      resetCourseForm();
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Courses List */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cursos</CardTitle>
              <CardDescription>Administra todos los cursos de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{course.title}</h3>
                            <Badge className={getLevelColor(course.level)}>
                              {course.level}
                            </Badge>
                            <Badge className={course.published ? '' : 'bg-yellow-100 text-yellow-800'}>
                              {course.published ? 'Publicado' : 'Borrador'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.instructor_name} • {course.students_count} estudiantes • ${course.price}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={deleteCourseLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="usuario@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-name">Nombre Completo</Label>
                  <Input
                    id="user-name"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Rol</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserRole) => 
                      setUserForm({ ...userForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Contraseña</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? "Dejar vacío para mantener actual" : "Contraseña"}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <Button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  disabled={createUserLoading || updateUserLoading}
                >
                  {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Button>
                {editingUser && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingUser(null);
                      resetUserForm();
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra todos los usuarios de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{user.full_name}</h3>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            {user.subscription_status && (
                              <Badge className="bg-green-100 text-green-800">
                                Suscripción Activa
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {user.email} • Registrado: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;