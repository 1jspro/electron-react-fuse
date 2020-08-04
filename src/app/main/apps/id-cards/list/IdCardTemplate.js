import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { removeIdCards } from '../store/idCardsSlice';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';

function IdCardTemplate(props) {
  const dispatch = useDispatch();
  const { template_type, data, ...other } = props;

  const membersData = props.data['members-data'] ? props.data['members-data'][0] : {};
  const adminData = props.data['adminData'] ? props.data['adminData'] : {};
  console.log(data);
  if (!data.card_type) {
    return <></>;
  }

  return (
    <div style={{"width": "100%", 'fontFamily': 'sans-serif'}}>
      <div className="card-front" style={{"width": "100%", "height":"475px","position": "relative"}} >
          <img src="assets/images/idCards/default_portrait_front_bg.jpg" style={{"position": "absolute", "top": 0, "left": 0}} />
          <div style={{"position": "absolute", "left": 0, "top" :0, 'zIndex': 1}}>
            <div className="header" style={{"padding": "0 24px"}}>
                <div className="logo-container" style={{"height": "36px", "display": "flex", "alignItems": "center", "justifyContent": "center", "marginBottom": "12px"}}>
                    <img className="brand-logo" style={{"maxHeight": "100%", "maxWidth": "100%"}} src={membersData.org_image} alt="Company Logo" />
                </div>
                <h1 className="brand" style={{"fontSize": "18px","fontWeight": "900","textTransform": "uppercase"}}>{membersData.org_name}</h1>
            </div>
            <div className="body" style={{"margin": "10px 0", "padding": "0 40px"}}>
                
                <img className="avatar" style={{"height": "70px", "width": "70px", "marginBottom": "5px", "objectFit": "cover", "objectPosition": "center", "borderRadius": "50%"}} src={membersData.profile_pic} alt="Profile" />
                <h4 className="user-name" style={{"textTransform": "uppercase","fontWeight": "700","lineHeight": "1.5","marginBottom": "16px"}}>
                    { membersData.first_name } <br />
                    { membersData.last_name }
                </h4>
                <div className="designation" style={{"fontFamily": "sans-serif","color": "white","fontWeight": "500","background": "rgba(17, 176, 222, 0.4)", "padding": "8px 20px"}}>
                    { membersData.position_name }
                </div>
            </div>
            <div className="footer" style={{"padding": "0 40px"}}>
                <div className="footer-row" style={{"display": "flex", "justifyContent": "space-between", "marginBottom": "12px"}}>
                    <div className="user-info">
                        <span className="info-title">SEX : </span>
                        <span className="info-content" style={{'textTransform': 'uppercase'}}>{ membersData.gender ? (membersData.gender.substr(0, 1)) : "" }</span>
                    </div>
                    <div className="user-info" style={{"display": "flex",
                        "flexDirection": "column",
                        "textAlign": "center"}}>
                        <span className="info-title" style={{"fontSize": "14px","fontWeight": "400"}}>ID NUMBER</span>
                        <span className="info-content" style={{"marginTop": "4px","fontWeight": "500"}}>
                            {membersData.id_card_number ?
                              <span>  { membersData.id_card_number }  </span>
                            :
                              <span>  "Id Number Not Generated" </span>
                            }
                        </span>
                    </div>
                </div>
                <div className="footer-row">
                    <div className="user-info">
                        <span className="info-title">{ membersData.level_name } : </span>
                        <span className="info-content">{ membersData.level_data_name }</span>
                    </div>
                </div>
            </div>
          </div>
      </div>
      {adminData && 
        <div className="card-back" style={{"width": "100%", "height":"475px","position": "relative"}} >
          <img src="assets/images/idCards/default_portrait_front_bg.jpg" style={{"position": "absolute", "top": 0, "left": 0}} />
          <div className="card-back-container" style={{"position": "absolute", "left": 0, "top" :0, 'zIndex': 1, "display": "flex",
            "flexDirection": "column",
            "justifyContent": "start",
            "alignContent": "center",
            "padding": "15px 40px",
            "textAlign": "center",
            "overflow": "hidden"}}>
            <p className="information" style={{"textAlign": "left",
              "lineHeight": "1.25",
              "fontFamily": "sans-serif",
              "fontWeight": "500",
              "fontSize": "16px",
              "minHeight": "220px",
              "marginBottom": "16px"}}>
                This is the
                property
                of { adminData.org_name } if found kindly return to the nearest office or
                call this
                number
                { adminData.phone_no } or email us { adminData.email }
            </p>
            <div className="signature-container" style={{"border": "1.5px solid #888888",
              "borderRadius": "4px",
              "height": "64px",
              "width": "150px",
              "margin": "0 auto",
              "display": "flex",
              "alignItems": "center",
              "padding": "4px",
              "justifyContent": "center"}}>
                {adminData.signature &&
                    <img style={{'maxWidth':'100px', "maxHeight": "100%", 'padding':'2px'}}  src={ adminData.signature } alt="" />
                }
            </div>
        </div>
      </div>}
    </div>
  );
}


export default IdCardTemplate;
