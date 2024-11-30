import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { taskService } from '../services/taskService';
import TaskList from '../components/tasks/TaskList';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import {
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Box,
    Grid,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TaskPage = () => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        status: 'ALL',
        priority: 'ALL',
        search: '',
    });

    // Create MUI theme based on our theme context
    const muiTheme = createTheme({
        palette: {
            mode: theme,
            ...(theme === 'dark' ? {
                background: {
                    default: '#1a1a1a',
                    paper: '#2d2d2d',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#b3b3b3',
                },
                primary: {
                    main: '#90caf9',
                },
                success: {
                    main: '#66bb6a',
                    light: '#81c784',
                    dark: '#388e3c',
                    contrastText: '#fff',
                },
                warning: {
                    main: '#ffa726',
                    light: '#ffb74d',
                    dark: '#f57c00',
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                error: {
                    main: '#f44336',
                    light: '#e57373',
                    dark: '#d32f2f',
                    contrastText: '#fff',
                },
            } : {
                background: {
                    default: '#f5f5f5',
                    paper: '#ffffff',
                },
            }),
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: theme === 'dark' 
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
    });

    const { data: allTasks, isError: isAllTasksError } = useQuery({
        queryKey: ['allTasks'],
        queryFn: taskService.getAllTasks,
    });

    const { 
        data: tasks, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: ['tasks', filters.search, filters.status, filters.priority],
        queryFn: () => taskService.searchTasks(
            filters.search, 
            filters.status, 
            filters.priority
        ),
    });
    
    const filteredTasks = tasks || [];

    if (isError) {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Box sx={{ p: 3 }}>
                    <Typography color="error" variant="h6">
                        Failed to load tasks. Please try again later.
                    </Typography>
                    {error instanceof Error && (
                        <Typography color="error.light" variant="body2">
                            Error: {error.message}
                        </Typography>
                    )}
                </Box>
            </MuiThemeProvider>
        );
    }

    const taskStats = allTasks?.reduce(
        (acc, task) => {
            acc.total++;
            acc[task.status]++;
            return acc;
        },
        {
            total: 0,
            OPEN: 0,
            IN_PROGRESS: 0,
            CLOSED: 0,
        }
    ) || {
        total: 0,
        OPEN: 0,
        IN_PROGRESS: 0,
        CLOSED: 0,
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };


    return (
        <MuiThemeProvider theme={muiTheme}>
            <Box sx={{ 
                maxWidth: 1200, 
                mx: 'auto', 
                py: 4, 
                px: 2,
                bgcolor: 'background.default',
                minHeight: '100vh',
            }}>
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        fontWeight="bold"
                        color="text.primary"
                    >
                        Task Management
                    </Typography>
                </Box>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="text.primary">
                            Task Overview
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: theme === 'dark' ? 'grey.800' : 'grey.50',
                                    borderRadius: 1,
                                }}>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Tasks
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                                        {taskStats.total}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: theme === 'dark' ? 'primary.dark' : 'primary.light',
                                    borderRadius: 1,
                                }}>
                                    <Typography color="primary.contrastText" variant="body2">
                                        In Progress
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
                                        {taskStats.IN_PROGRESS}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: theme === 'dark' ? 'warning.dark' : 'warning.light',
                                    borderRadius: 1,
                                }}>
                                    <Typography color="warning.contrastText" variant="body2">
                                        OPEN
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="warning.contrastText">
                                        {taskStats.OPEN}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: theme === 'dark' ? 'success.dark' : 'success.light',
                                    borderRadius: 1,
                                }}>
                                    <Typography color="success.contrastText" variant="body2">
                                        Completed
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.contrastText">
                                        {taskStats.CLOSED}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' }, 
                            gap: 2 
                        }}>
                            <TextField
                                fullWidth
                                placeholder="Search tasks..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                name="search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                minWidth: { xs: '100%', md: '320px' } 
                            }}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filters.status}
                                        label="Status"
                                        name="status"
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="ALL">All Status</MenuItem>
                                        <MenuItem value="OPEN">Not Started</MenuItem>
                                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                        <MenuItem value="CLOSED">Completed</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={filters.priority}
                                        label="Priority"
                                        name="priority"
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="ALL">All Priority</MenuItem>
                                        <MenuItem value="LOW">Low</MenuItem>
                                        <MenuItem value="MEDIUM">Medium</MenuItem>
                                        <MenuItem value="HIGH">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <TaskList 
    tasks={filteredTasks} 
    isLoading={isLoading} 
    searchTerm={filters.search}
    status={filters.status}
    priority={filters.priority}
/>
                    </CardContent>
                </Card>
            </Box>
        </MuiThemeProvider>
    );
};

export default TaskPage;
