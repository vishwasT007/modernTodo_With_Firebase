import React, { memo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { Box, Typography, Paper } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { Todo, TodoCardProps } from '../types';
import DraggableTodoCard from './DraggableTodoCard';

interface DraggableTodoListProps {
  todos: Todo[];
  onTodoReorder: (todos: Todo[]) => void;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, todo: Todo) => void;
  loading?: boolean;
}

const DraggableTodoList: React.FC<DraggableTodoListProps> = memo(({
  todos,
  onTodoReorder,
  onToggleComplete,
  onEdit,
  onDelete,
  onMenuOpen,
  loading = false,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id || todo.todoId === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over.id || todo.todoId === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTodos = arrayMove(todos, oldIndex, newIndex);
        onTodoReorder(newTodos);
      }
    }
  }, [todos, onTodoReorder]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Loading todos...
        </Typography>
      </Box>
    );
  }

  if (todos.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'background.default',
          borderRadius: 2,
        }}
      >
        <DragIndicator sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No todos found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first todo to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={todos.map(todo => todo.id || todo.todoId || '')}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {todos.map((todo) => (
            <DraggableTodoCard
              key={todo.id || todo.todoId}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onMenuOpen={onMenuOpen}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
});

DraggableTodoList.displayName = 'DraggableTodoList';

export default DraggableTodoList;
