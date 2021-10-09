import React from 'react'
import {connect} from 'react-redux'
import PropsType from 'prop-types'



const Alert = ({alerts}) => alerts!==null && alerts.length>0 && alerts.map(i=>
    
    <div key={i.id} className={`alert alert-${i.alertType}`} >{i.msg}</div>
    )


alert.PropsType={
    alerts:PropsType.array.isRequired
}

const mapStateToProps=state=>({
 alerts:state.alert
});


export default connect(mapStateToProps,null)(Alert)