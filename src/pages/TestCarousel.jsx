import { Helmet } from 'react-helmet-async';

import { Box, Card, Link, Stack, Button, Divider, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function TestCarousel() {
  return (
    <>
      <Helmet>
        <title> TestCarousel </title>
      </Helmet>

      <Box>
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4">Sign in to Minimal</Typography>

            <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
              Don’t have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }}>
                Get started
              </Link>
            </Typography>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                onClick={() => console.log('test')}
              >
                TEST
              </Button>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
