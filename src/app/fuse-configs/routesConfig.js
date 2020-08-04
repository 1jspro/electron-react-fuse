import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import authRoleExamplesConfigs from 'app/main/auth/authRoleExamplesConfigs';
import CallbackConfig from 'app/main/callback/CallbackConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import ForgotPasswordConfig from 'app/main/forgot-password/ForgotPasswordConfig';
import ResetPasswordConfig from 'app/main/reset-password/ResetPasswordConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import RegisterMemberConfig from 'app/main/register-member/RegisterMemberConfig';
import ProfileConfig from 'app/main/profile/ProfileConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MemberDetailsConfig from '../main/member-details/MemberDetailsConfig';

const routeConfigs = [
  ...appsConfigs,
  ...authRoleExamplesConfigs,
  LogoutConfig,
  LoginConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  RegisterConfig,
  ProfileConfig,
  RegisterMemberConfig,
  LogoutConfig,
  CallbackConfig,
  MemberDetailsConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  /*...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'super-admin', 'member', 'member-admin', 'staff']),*/
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: '/',
    exact: true,
    element: <Navigate to="apps/dashboard" />,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '*',
    element: <Navigate to="apps/404" />,
  },
];

export default routes;
