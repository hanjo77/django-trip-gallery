import PropTypes from 'prop-types';
import React from 'react';

const Image = ({ data }) =>
    <div>
        <div><img src={data.image} /></div>
    </div>;

Image.propTypes = {
    data: PropTypes.object
};

export default Image;
