// import logo from './logo.svg';
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'ap-south-1_2FbUOELOI',
    ClientId: 'e6ub2h7rhhpor79kjtqdssl82'
  };

export default new CognitoUserPool(poolData)
