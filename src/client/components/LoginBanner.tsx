import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginBannerProps {
    userId: string | null;
}

const LoginBanner: React.FC<LoginBannerProps> = ({ userId }) => {
    const navigate = useNavigate();

    if (userId) {
        return null;
    }

    return (
        <Box
            sx={{
                backgroundColor: 'lightgrey',
                color: 'black',
                textAlign: 'center',
                py: 2,
                px: 3,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>
                Join Us Today!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Log in or register to unlock features like creating a collection, sharing content, and more!
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/register')}
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default LoginBanner;