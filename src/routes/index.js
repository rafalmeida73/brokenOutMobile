import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from '../../src/fireConnection';

import Login from '../screen/Login';
import Home from '../screen/Home';
import Subscribe from '../screen/Subscribe';
import Games from '../screen/Games';
import GameDetail from '../screen/GameDetail';
import EditGame from '../screen/EditGame';
import AddGame from '../screen/AddGame';


const { Navigator, Screen } = createStackNavigator();

function Routes() {
  const [logged] = useState(firebase.getCurrentUid());
  const [currentUid, setCurrentUid] = useState(firebase.getCurrentUid());

  useEffect(() => {
    if (logged !== null) {
      return (
        setCurrentUid(true)
      )
    }
  }, []);

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>

        {currentUid ?
          <>
            <Screen name="Home"
              component={Home}
            />
            <Screen name="Login"
              component={Login}
            />
          </>
          :
          <>
            <Screen name="Login"
              component={Login}
            />
            <Screen name="Home"
              component={Home}
            />
          </>
        }

        <Screen name="Games"
          component={Games}
        />

        <Screen name="AddGame"
          component={AddGame}
        />

        <Screen name="EditGame"
          component={EditGame}
        />

        <Screen name="GameDetail"
          component={GameDetail}
        />

        <Screen name="Subscribe"
          component={Subscribe}
        />

      </Navigator>
    </NavigationContainer>
  );
}

export default Routes;