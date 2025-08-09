import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Badge
} from '@mui/material';
import {
  Pool as PoolIcon,
  Add as AddIcon,
  List as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IncidentForm } from './components/IncidentForm';
import { IncidentList } from './components/IncidentList';
import { useIncidentStore } from './store/incidentStore';
import { motion, AnimatePresence } from 'framer-motion';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box>{children}</Box>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const { incidents, loadIncidents } = useIncidentStore();

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <PoolIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Diving Incident Registry
              </Typography>
              <Badge badgeContent={incidents.length} color="secondary">
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Total Incidents
                </Typography>
              </Badge>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                icon={<AddIcon />}
                label="Register Incident"
                iconPosition="start"
              />
              <Tab
                icon={<ListIcon />}
                label="View Incidents"
                iconPosition="start"
              />
              <Tab
                icon={<DashboardIcon />}
                label="Dashboard"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <IncidentForm />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <IncidentList />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Dashboard />
          </TabPanel>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function Dashboard() {
  const { incidents } = useIncidentStore();
  
  const stats = {
    total: incidents.length,
    typeI: incidents.filter(i => i.incident.type === 'DCS Type I').length,
    typeII: incidents.filter(i => i.incident.type === 'DCS Type II').length,
    age: incidents.filter(i => i.incident.type === 'AGE').length,
    hyperbaric: incidents.filter(i => i.incident.hyperbaricTreatment).length,
    fullRecovery: incidents.filter(i => i.incident.outcome === 'full recovery').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3,
          mt: 3
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Incidents
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="warning.main">
              {stats.typeI}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              DCS Type I
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="error.main">
              {stats.typeII}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              DCS Type II
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="error.dark">
              {stats.age}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AGE Cases
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="info.main">
              {stats.hyperbaric}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hyperbaric Treatments
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="success.main">
              {stats.fullRecovery}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Full Recoveries
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {incidents.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Recent Incidents
          </Typography>
          <Box sx={{ mt: 2 }}>
            {incidents.slice(-5).reverse().map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {incident.diver.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {incident.location.site}, {incident.location.country}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(incident.dateTime).toLocaleDateString()}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;