import { Navigate } from 'react-router'
function Guard({children}) {
    let token = sessionStorage.getItem('loginToken')
  return <>
  {
    token ? children : <Navigate to='/login'/>
    }</>
}

export default Guard