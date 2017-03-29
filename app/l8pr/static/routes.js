import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './app'
import { HomeView, LoginView, ProtectedView, NotFoundView } from './containers'
import requireAuthentication from './utils/requireAuthentication'

export default(
    <Route path="/" component={App}>
        <IndexRoute component={HomeView}/>
        <Route path="*" component={HomeView}/>
        {/**<Route path="protected" component={requireAuthentication(ProtectedView)}/>*/}
        {/**<Route path="login" component={LoginView}/>*/}
        {/**<Route path="*" component={NotFoundView}/>*/}
    </Route>
)
