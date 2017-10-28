import PropTypes from 'prop-types';
import React from 'react';
import Image from './Image';

const images = [
    {
        url: 'http://streetart.resolve.bar/api/images/1/?format=json',
        image: 'http://streetart.resolve.bar/media/images/IMG_2496.jpg',
        title: 'Bristol',
        latitude: 51.45631111111111,
        longitude: -2.5948888888888892
    }
];

const ImageTable = ({ filter }) => {
    let rows = [];

    images.forEach(i => {
        const titleText = i.title.toLowerCase();
        const filterText = filter.toLowerCase();

        if (titleText.indexOf(filterText) !== -1) {
            rows.push(
                <Image key={i.url} data={i} />
            );
        }
    });

    return <div> {rows} </div>;
};

ImageTable.propTypes = {
    filter: PropTypes.string
};

export default ImageTable;
