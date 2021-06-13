import { Box } from '@material-ui/core';
import React from 'react';

const PlaceHolder = (props) => {
    const { children, ...rest } = props;
    return (
        <Box
            {...rest}
            style={{
                height: '200px',
                width: '200px',
                background: '#00e676',
                outline: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Box style={{ height: '100%', width: '100%' }}>{children}</Box>
        </Box>
    );
};
export default PlaceHolder;
