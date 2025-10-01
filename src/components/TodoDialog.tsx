import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Stack,
} from '@mui/material';
import {
  Close,
  AddTask,
  Save,
  PriorityHigh,
  Event,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Todo, TodoFormData } from '../types';

interface TodoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => Promise<void>;
  todo?: Todo | null;
  loading?: boolean;
}

const TodoDialog: React.FC<TodoDialogProps> = memo(({
  open,
  onClose,
  onSubmit,
  todo,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<{
    title: string;
    body: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: Dayjs | null;
  }>({
    title: '',
    body: '',
    priority: 'medium',
    dueDate: null,
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
    body?: string;
  }>({});

  // Initialize form data when todo changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        body: todo.body || '',
        priority: (todo.priority as 'low' | 'medium' | 'high') || 'medium',
        dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
      });
    } else {
      setFormData({
        title: '',
        body: '',
        priority: 'medium',
        dueDate: null,
      });
    }
    setErrors({});
  }, [todo, open]);

  const handleChange = useCallback((field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleDateChange = useCallback((date: Dayjs | null) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (formData.body && formData.body.length > 1000) {
      newErrors.body = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const submitData: TodoFormData = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate ? formData.dueDate.toDate() : null,
        completed: todo?.completed || false,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting todo:', error);
    }
  }, [formData, todo, validate, onSubmit, onClose]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha('#f8f9fa', 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <AddTask sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {todo ? 'Edit Todo' : 'Create New Todo'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {todo ? 'Update your task details' : 'Add a new task to your list'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              autoFocus
              label="Title"
              placeholder="What needs to be done?"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title || `${formData.title.length}/200 characters`}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              }}
            />

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Add more details about your task..."
              fullWidth
              multiline
              rows={4}
              value={formData.body}
              onChange={handleChange('body')}
              error={!!errors.body}
              helperText={errors.body || `${formData.body.length}/1000 characters`}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              }}
            />

            <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'}>
              {/* Priority */}
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleChange('priority')}
                  label="Priority"
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    },
                  }}
                >
                  <MenuItem value="low">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PriorityHigh sx={{ fontSize: 20, color: theme.palette.info.main }} />
                      <span>Low Priority</span>
                      <Chip 
                        label="Low" 
                        size="small" 
                        sx={{ 
                          ml: 'auto',
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 600,
                        }} 
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PriorityHigh sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                      <span>Medium Priority</span>
                      <Chip 
                        label="Medium" 
                        size="small" 
                        sx={{ 
                          ml: 'auto',
                          backgroundColor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                        }} 
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PriorityHigh sx={{ fontSize: 20, color: theme.palette.error.main }} />
                      <span>High Priority</span>
                      <Chip 
                        label="High" 
                        size="small" 
                        sx={{ 
                          ml: 'auto',
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          fontWeight: 600,
                        }} 
                      />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Due Date */}
              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Priority Preview */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `2px solid ${getPriorityColor(formData.priority)}`,
                backgroundColor: alpha(getPriorityColor(formData.priority), 0.05),
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <PriorityHigh sx={{ color: getPriorityColor(formData.priority), fontSize: 28 }} />
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Priority Level: {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.priority === 'high' && 'This task requires immediate attention'}
                  {formData.priority === 'medium' && 'This task should be completed soon'}
                  {formData.priority === 'low' && 'This task can be done when you have time'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderColor: alpha(theme.palette.text.primary, 0.2),
              '&:hover': {
                borderColor: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.text.primary, 0.05),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Saving...' : todo ? 'Update Todo' : 'Create Todo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

TodoDialog.displayName = 'TodoDialog';

export default TodoDialog;

