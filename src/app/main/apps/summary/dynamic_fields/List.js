import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';
import ListHeader from './ListHeader';
import ListTable from './ListTable';
import { useParams } from 'react-router-dom';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },
  '& .FusePageCarded-content': {
    display: 'flex',
  },
  '& .FusePageCarded-contentCard': {
    overflow: 'hidden',
  },
}));

function List() {
  const { dynamicId , dynamicName, valueName} = useParams();
  return <Root header={<ListHeader dynamicName={dynamicName} valueName={valueName} />} content={<ListTable dynamicId={dynamicId} dynamicName={dynamicName} valueName={valueName} />} innerScroll />;
}

export default withReducer('dynamicFieldsSummary', reducer)(List);
