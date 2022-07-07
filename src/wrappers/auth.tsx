import { Navigate, Outlet } from 'umi'

export default (props: any) => {
    console.log('auth>>>>');
    const isLogin  = true;
    if (isLogin) {
        return <Outlet />;
    } else{
        return <Navigate to="/login" />;
    }
}