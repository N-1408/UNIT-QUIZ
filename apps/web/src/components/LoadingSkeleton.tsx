import { Box, Skeleton } from "@mui/material";

type LoadingSkeletonProps = {
  variant: "card" | "stats" | "list";
};

const orangeShimmer = {
  "&::after": {
    background: "linear-gradient(90deg, transparent, rgba(255, 95, 0, 0.08), transparent)"
  }
} as const;

export const LoadingSkeleton = ({ variant }: LoadingSkeletonProps) => {
  if (variant === "card") {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, ...orangeShimmer }} />
        <Skeleton variant="text" width="60%" sx={{ mt: 1, ...orangeShimmer }} />
        <Skeleton variant="text" width="40%" sx={{ ...orangeShimmer }} />
      </Box>
    );
  }

  if (variant === "stats") {
    return (
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ flex: 1, textAlign: "center" }}>
            <Skeleton
              variant="circular"
              width={60}
              height={60}
              sx={{ mx: "auto", ...orangeShimmer }}
            />
            <Skeleton variant="text" width="80%" sx={{ mt: 1, mx: "auto", ...orangeShimmer }} />
            <Skeleton variant="text" width="60%" sx={{ mx: "auto", ...orangeShimmer }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, ...orangeShimmer }} />
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};
