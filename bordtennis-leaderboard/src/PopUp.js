import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DropDown from './DropDown';

export default function PopUp({spillere}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button 
        variant="outlined" 
        onClick={handleClickOpen}
        sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }} // Custom styles for the button
      >
        Register ny kamp
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Registrer kamp</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Registrer spillere og poengsum.
          </DialogContentText>
          <DropDown spillere={spillere} navn='spiller 1'/>
          <DropDown spillere={spillere} navn='spiller 2'/>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Avbryt</Button>
          <Button type="submit">Lagre</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
