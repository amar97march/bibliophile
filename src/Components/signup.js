import React from "react";
// import { useHistory } from 'react-router-dom';
// import "../css/signin.css";
import { Grid, Paper, Avatar, TextField, Button, Typography } from '@material-ui/core'
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Signup = () => {
    const paperStyle = { padding: "30px 20px", height: '580px', width: 290, margin: '0px auto' }
    const avatarStyle = { backgroundColor: "green" }
    const marginTop = { marginTop: 15 }
    return (
        <Grid>
            <Paper style={paperStyle}>
                <Grid align="center">
                    <Avatar style={avatarStyle}><AddCircleOutlinedIcon /></Avatar>
                    <h2>Sign Up</h2>
                    <Typography variant="caption">Please fill this form to create an account</Typography>
                </Grid>
                <form>
                    <TextField fullWidth label="First Name" placeholder="Enter your first name" />
                    <TextField fullWidth label="Last Name" placeholder="Enter your last name" />
                    <TextField fullWidth label="Email" placeholder="Enter your email" />
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" style={{ display: "initial" }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label="Phone Number" placeholder="Enter your phone number" />
                    <TextField fullWidth label="Password" placeholder="Enter your password" />
                    <TextField fullWidth label="Confirm Password" placeholder="Enter your password again" />
                    <FormControlLabel
                        control={<Checkbox name="checkedA" />}
                        label="I accept the terms and conditions"
                    />
                    <Button type="submit" variant="contained" color="primary" >Sign Up</Button>
                </form>
            </Paper>
        </Grid>
    )
}

export default Signup