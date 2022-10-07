
import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
import { SubscribedChannel } from './SubscribedChannels';

const clientId = '200123497530-buio2qqs2dgkr3ilk454cttqf42ugcld.apps.googleusercontent.com';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

function App() {

  const [token, setToken] = useState(null);
  const [subscriptions, setSubscriptions ] = useState([]);
  
  const responseGoogle = (response) => {
    setToken(response.accessToken);
    getChannels();
  }
  const logOut = () => {
    setToken(null);
    setSubscriptions([]);
  }

  const getSubscriptions = () => {
    return gapi.client.youtube.subscriptions.list({
      "part": [
        "snippet"
      ],
      "mine": true,
      "maxResults":25
    })
      .then(function (response) {
        const items = response.result.items;
        setSubscriptions(items)
      },
      function (err) { console.error("Execute error", err); });
  }

  const getChannels = () => {
    return gapi.client.youtube.channels.list({
      "part": [
        "snippet"
      ],
      "mine": true,
      "maxResults":25
    })
      .then(function (response) {
        const items = response.result.items;
        setSubscriptions(items)
      },
      function (err) { console.error("Execute error", err); });
  }

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: clientId,
        scope: SCOPES
      })
    };
    gapi.load('client:auth2', initClient);
  })
  return (
    <div className='container'>
      {token ?

        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={logOut}
        /> :
        <div>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
        </div>
      }
      {
        subscriptions.length > 0 && <h1>My Channels</h1>
      }
      {subscriptions.map(item=> <SubscribedChannel {...item}/> )}
    </div>

  );
}

export default App;
