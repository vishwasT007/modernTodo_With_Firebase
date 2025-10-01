import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';

interface TodoSkeletonProps {
  count?: number;
}

const TodoSkeleton: React.FC<TodoSkeletonProps> = memo(({ count = 3 }) => {
  const theme = useTheme();

  const SkeletonCard = memo(() => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
      }}
    >
      <CardContent sx={{ pt: 3, pb: 2 }}>
        {/* Header with checkbox and title */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          {/* Checkbox skeleton */}
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ flexShrink: 0 }}
          />

          {/* Title and description */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton
              variant="text"
              width="80%"
              height={28}
              sx={{ mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{ mb: 0.5 }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={20}
            />
          </Box>

          {/* Priority indicator skeleton */}
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{ flexShrink: 0 }}
          />
        </Box>

        {/* Tags skeleton */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={24}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        {/* Footer skeleton */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={16}
          />
          <Skeleton
            variant="text"
            width={80}
            height={16}
          />
        </Box>
      </CardContent>
    </Card>
  ));

  SkeletonCard.displayName = 'SkeletonCard';

  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Box>
  );
});

TodoSkeleton.displayName = 'TodoSkeleton';

export default TodoSkeleton;
