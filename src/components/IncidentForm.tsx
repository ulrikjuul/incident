import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { useIncidentStore } from '../store/incidentStore';
import type { DivingIncident } from '../types/incident';
import {
  SYMPTOM_OPTIONS,
  FIRST_AID_OPTIONS,
  CONTRIBUTING_FACTORS
} from '../types/incident';

const steps = ['Diver Information', 'Dive Details', 'Incident Details', 'Contributing Factors & Notes', 'Reporter Information'];

export const IncidentForm: React.FC = () => {
  const { addIncident } = useIncidentStore();
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<DivingIncident>>({
    dateTime: new Date().toISOString(),
    location: {
      site: '',
      country: ''
    },
    diver: {
      name: '',
      age: 0,
      certificationLevel: '',
      yearsOfExperience: 0,
      numberOfDives: 0
    },
    dive: {
      maxDepth: 0,
      bottomTime: 0,
      waterTemperature: 0,
      visibility: 0,
      diveType: 'recreational',
      gasUsed: '',
      diveComputer: '',
      decoStops: []
    },
    incident: {
      type: 'DCS Type I',
      symptoms: [],
      onsetTime: '',
      firstAid: [],
      evacuation: false,
      hyperbaricTreatment: false,
      outcome: 'full recovery'
    },
    contributingFactors: [],
    notes: '',
    reportedBy: {
      name: '',
      role: '',
      contact: ''
    }
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const incident: DivingIncident = {
      ...formData as DivingIncident,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await addIncident(incident);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setActiveStep(0);
      window.location.reload();
    }, 3000);
  };

  const handleDecoStopAdd = () => {
    setFormData(prev => ({
      ...prev,
      dive: {
        ...prev.dive!,
        decoStops: [...(prev.dive?.decoStops || []), { depth: 0, duration: 0 }]
      }
    }));
  };

  const handleDecoStopRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dive: {
        ...prev.dive!,
        decoStops: prev.dive?.decoStops?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diver Name"
                value={formData.diver?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  diver: { ...prev.diver!, name: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                value={formData.diver?.age || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  diver: { ...prev.diver!, age: parseInt(e.target.value) }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Certification Level"
                value={formData.diver?.certificationLevel || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  diver: { ...prev.diver!, certificationLevel: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Years of Experience"
                value={formData.diver?.yearsOfExperience || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  diver: { ...prev.diver!, yearsOfExperience: parseInt(e.target.value) }
                }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Dives"
                value={formData.diver?.numberOfDives || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  diver: { ...prev.diver!, numberOfDives: parseInt(e.target.value) }
                }))}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date & Time of Dive"
                  value={dayjs(formData.dateTime)}
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setFormData(prev => ({
                        ...prev,
                        dateTime: newValue.toISOString()
                      }));
                    }
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Dive Site"
                value={formData.location?.site || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location!, site: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.location?.country || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location!, country: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Depth (meters)"
                value={formData.dive?.maxDepth || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, maxDepth: parseFloat(e.target.value) }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Bottom Time (minutes)"
                value={formData.dive?.bottomTime || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, bottomTime: parseInt(e.target.value) }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Water Temperature (°C)"
                value={formData.dive?.waterTemperature || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, waterTemperature: parseFloat(e.target.value) }
                }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Visibility (meters)"
                value={formData.dive?.visibility || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, visibility: parseFloat(e.target.value) }
                }))}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Dive Type</InputLabel>
                <Select
                  value={formData.dive?.diveType || 'recreational'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dive: { ...prev.dive!, diveType: e.target.value as any }
                  }))}
                  label="Dive Type"
                >
                  <MenuItem value="recreational">Recreational</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Gas Used"
                value={formData.dive?.gasUsed || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, gasUsed: e.target.value }
                }))}
                placeholder="e.g., Air, Nitrox 32%, Trimix"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dive Computer Model"
                value={formData.dive?.diveComputer || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dive: { ...prev.dive!, diveComputer: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="subtitle1">Decompression Stops</Typography>
                <IconButton onClick={handleDecoStopAdd} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              {formData.dive?.decoStops?.map((stop, index) => (
                <Box key={index} display="flex" gap={2} mt={2}>
                  <TextField
                    type="number"
                    label="Depth (m)"
                    value={stop.depth}
                    onChange={(e) => {
                      const newStops = [...(formData.dive?.decoStops || [])];
                      newStops[index].depth = parseFloat(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        dive: { ...prev.dive!, decoStops: newStops }
                      }));
                    }}
                  />
                  <TextField
                    type="number"
                    label="Duration (min)"
                    value={stop.duration}
                    onChange={(e) => {
                      const newStops = [...(formData.dive?.decoStops || [])];
                      newStops[index].duration = parseInt(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        dive: { ...prev.dive!, decoStops: newStops }
                      }));
                    }}
                  />
                  <IconButton onClick={() => handleDecoStopRemove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Incident Type</InputLabel>
                <Select
                  value={formData.incident?.type || 'DCS Type I'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incident: { ...prev.incident!, type: e.target.value as any }
                  }))}
                  label="Incident Type"
                >
                  <MenuItem value="DCS Type I">DCS Type I</MenuItem>
                  <MenuItem value="DCS Type II">DCS Type II</MenuItem>
                  <MenuItem value="AGE">Arterial Gas Embolism (AGE)</MenuItem>
                  <MenuItem value="Barotrauma">Barotrauma</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Symptoms</InputLabel>
                <Select
                  multiple
                  value={formData.incident?.symptoms || []}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      incident: { ...prev.incident!, symptoms: (e.target as any).value as string[] }
                    }));
                  }}
                  input={<OutlinedInput label="Symptoms" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SYMPTOM_OPTIONS.map((symptom) => (
                    <MenuItem key={symptom} value={symptom}>
                      <Checkbox checked={(formData.incident?.symptoms || []).indexOf(symptom) > -1} />
                      <ListItemText primary={symptom} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Symptom Onset Time"
                value={formData.incident?.onsetTime || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  incident: { ...prev.incident!, onsetTime: e.target.value }
                }))}
                placeholder="e.g., 30 minutes after surfacing"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>First Aid Given</InputLabel>
                <Select
                  multiple
                  value={formData.incident?.firstAid || []}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      incident: { ...prev.incident!, firstAid: (e.target as any).value as string[] }
                    }));
                  }}
                  input={<OutlinedInput label="First Aid Given" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {FIRST_AID_OPTIONS.map((aid) => (
                    <MenuItem key={aid} value={aid}>
                      <Checkbox checked={(formData.incident?.firstAid || []).indexOf(aid) > -1} />
                      <ListItemText primary={aid} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Emergency Evacuation</InputLabel>
                <Select
                  value={formData.incident?.evacuation ? 'yes' : 'no'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incident: { ...prev.incident!, evacuation: e.target.value === 'yes' }
                  }))}
                  label="Emergency Evacuation"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Hyperbaric Treatment</InputLabel>
                <Select
                  value={formData.incident?.hyperbaricTreatment ? 'yes' : 'no'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incident: { ...prev.incident!, hyperbaricTreatment: e.target.value === 'yes' }
                  }))}
                  label="Hyperbaric Treatment"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.incident?.hyperbaricTreatment && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Table Used"
                  value={formData.incident?.treatmentTable || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incident: { ...prev.incident!, treatmentTable: e.target.value }
                  }))}
                  placeholder="e.g., USN Table 6, USN Table 5"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Outcome</InputLabel>
                <Select
                  value={formData.incident?.outcome || 'full recovery'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incident: { ...prev.incident!, outcome: e.target.value as any }
                  }))}
                  label="Outcome"
                >
                  <MenuItem value="full recovery">Full Recovery</MenuItem>
                  <MenuItem value="partial recovery">Partial Recovery</MenuItem>
                  <MenuItem value="ongoing treatment">Ongoing Treatment</MenuItem>
                  <MenuItem value="fatal">Fatal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Contributing Factors</InputLabel>
                <Select
                  multiple
                  value={formData.contributingFactors || []}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      contributingFactors: (e.target as any).value as string[]
                    }));
                  }}
                  input={<OutlinedInput label="Contributing Factors" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {CONTRIBUTING_FACTORS.map((factor) => (
                    <MenuItem key={factor} value={factor}>
                      <Checkbox checked={(formData.contributingFactors || []).indexOf(factor) > -1} />
                      <ListItemText primary={factor} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Additional Notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                placeholder="Any additional information about the incident..."
              />
            </Grid>
          </Grid>
        );
      
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reporter Name"
                value={formData.reportedBy?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reportedBy: { ...prev.reportedBy!, name: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Reporter Role"
                value={formData.reportedBy?.role || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reportedBy: { ...prev.reportedBy!, role: e.target.value }
                }))}
                placeholder="e.g., Dive Master, Buddy, Medical Personnel"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contact Information"
                value={formData.reportedBy?.contact || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reportedBy: { ...prev.reportedBy!, contact: e.target.value }
                }))}
                placeholder="Email or Phone"
                required
              />
            </Grid>
          </Grid>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert severity="success" sx={{ mb: 3 }}>
            Incident report has been successfully submitted and saved!
          </Alert>
        </motion.div>
      )}
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register Diving Decompression Incident
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent(activeStep)}
        </motion.div>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                color="primary"
              >
                Submit Report
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                color="primary"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};