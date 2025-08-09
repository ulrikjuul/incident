import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Pool as PoolIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useIncidentStore } from '../store/incidentStore';
import type { DivingIncident } from '../types/incident';
import dayjs from 'dayjs';

export const IncidentList: React.FC = () => {
  const { incidents, deleteIncident } = useIncidentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<DivingIncident | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);

  const filteredIncidents = incidents.filter(incident => {
    const searchLower = searchTerm.toLowerCase();
    return (
      incident.diver.name.toLowerCase().includes(searchLower) ||
      incident.location.site.toLowerCase().includes(searchLower) ||
      incident.location.country.toLowerCase().includes(searchLower) ||
      incident.incident.type.toLowerCase().includes(searchLower)
    );
  });

  const handleView = (incident: DivingIncident) => {
    setSelectedIncident(incident);
  };

  const handleDeleteClick = (id: string) => {
    setIncidentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (incidentToDelete) {
      await deleteIncident(incidentToDelete);
      setDeleteConfirmOpen(false);
      setIncidentToDelete(null);
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'DCS Type II':
      case 'AGE':
        return 'error';
      case 'DCS Type I':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'full recovery':
        return 'success';
      case 'partial recovery':
        return 'warning';
      case 'ongoing treatment':
        return 'info';
      case 'fatal':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Incident Reports
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body2" color="text.secondary">
          Total Incidents: {filteredIncidents.length}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredIncidents.map((incident, index) => (
            <Grid item xs={12} md={6} lg={4} key={incident.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {incident.diver.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(incident.dateTime).format('MMM DD, YYYY HH:mm')}
                        </Typography>
                      </Box>
                      <Chip
                        label={incident.incident.type}
                        color={getSeverityColor(incident.incident.type)}
                        size="small"
                        icon={<WarningIcon />}
                      />
                    </Box>
                    
                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        icon={<PoolIcon />}
                        label={`${incident.dive.maxDepth}m / ${incident.dive.bottomTime}min`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={incident.location.site}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        {incident.location.country}
                      </Typography>
                      <Chip
                        label={incident.incident.outcome}
                        color={getOutcomeColor(incident.incident.outcome)}
                        size="small"
                      />
                    </Box>
                    
                    {incident.incident.hyperbaricTreatment && (
                      <Box display="flex" alignItems="center" mb={2}>
                        <HospitalIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Hyperbaric treatment administered
                        </Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" gap={1} mt={2}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(incident)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(incident.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {filteredIncidents.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No incidents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by registering a new incident'}
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this incident report? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Incident Details Dialog */}
      <Dialog
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedIncident && (
          <>
            <DialogTitle>
              Incident Details - {selectedIncident.diver.name}
            </DialogTitle>
            <DialogContent>
              <Box py={2}>
                <Typography variant="h6" gutterBottom>Diver Information</Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Age</Typography>
                    <Typography>{selectedIncident.diver.age}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Certification</Typography>
                    <Typography>{selectedIncident.diver.certificationLevel}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Experience</Typography>
                    <Typography>{selectedIncident.diver.yearsOfExperience} years</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Total Dives</Typography>
                    <Typography>{selectedIncident.diver.numberOfDives}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Dive Details</Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                    <Typography>{dayjs(selectedIncident.dateTime).format('MMM DD, YYYY HH:mm')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Typography>{selectedIncident.location.site}, {selectedIncident.location.country}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Max Depth</Typography>
                    <Typography>{selectedIncident.dive.maxDepth} meters</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Bottom Time</Typography>
                    <Typography>{selectedIncident.dive.bottomTime} minutes</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Water Temperature</Typography>
                    <Typography>{selectedIncident.dive.waterTemperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Visibility</Typography>
                    <Typography>{selectedIncident.dive.visibility} meters</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Dive Type</Typography>
                    <Typography>{selectedIncident.dive.diveType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Gas Used</Typography>
                    <Typography>{selectedIncident.dive.gasUsed}</Typography>
                  </Grid>
                </Grid>

                {selectedIncident.dive.decoStops.length > 0 && (
                  <>
                    <Typography variant="body2" color="text.secondary">Decompression Stops</Typography>
                    <Box mb={3}>
                      {selectedIncident.dive.decoStops.map((stop, idx) => (
                        <Typography key={idx}>
                          {stop.depth}m for {stop.duration} minutes
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Incident Information</Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Typography>{selectedIncident.incident.type}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Symptoms</Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {selectedIncident.incident.symptoms.map((symptom) => (
                        <Chip key={symptom} label={symptom} size="small" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Onset Time</Typography>
                    <Typography>{selectedIncident.incident.onsetTime}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">First Aid</Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {selectedIncident.incident.firstAid.map((aid) => (
                        <Chip key={aid} label={aid} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Evacuation</Typography>
                    <Typography>{selectedIncident.incident.evacuation ? 'Yes' : 'No'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Hyperbaric Treatment</Typography>
                    <Typography>{selectedIncident.incident.hyperbaricTreatment ? 'Yes' : 'No'}</Typography>
                  </Grid>
                  {selectedIncident.incident.treatmentTable && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Treatment Table</Typography>
                      <Typography>{selectedIncident.incident.treatmentTable}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Outcome</Typography>
                    <Chip
                      label={selectedIncident.incident.outcome}
                      color={getOutcomeColor(selectedIncident.incident.outcome)}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Contributing Factors</Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {selectedIncident.contributingFactors.map((factor) => (
                    <Chip key={factor} label={factor} size="small" variant="outlined" />
                  ))}
                </Box>

                {selectedIncident.notes && (
                  <>
                    <Typography variant="h6" gutterBottom>Additional Notes</Typography>
                    <Typography variant="body2" mb={3}>{selectedIncident.notes}</Typography>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Reported By</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography>{selectedIncident.reportedBy.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Typography>{selectedIncident.reportedBy.role}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Contact</Typography>
                    <Typography>{selectedIncident.reportedBy.contact}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedIncident(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};