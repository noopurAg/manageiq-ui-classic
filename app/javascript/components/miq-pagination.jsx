import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'carbon-components-react';

const getItemRangeText = (min, max, totalItems) => `${min}-${max} ${__('of')} ${totalItems} ${__('items')}`;

const getPageRangeText = (current, total) => `${__('of')} ${total} ${total === 1 ? __('page') : __('pages')}`;

const MiqPagination = ({
  pageOptions: {
    page, pageSizes, pageSize, totalItems, onPageChange,
  },
}) => (
  <Pagination
    className="miq-pagination"
    itemsPerPageText={__('Items per page:')}
    backwardText={__('Previous page')}
    forwardText={__('Next page')}
    itemRangeText={(min, max) => getItemRangeText(min, max, totalItems)}
    pageRangeText={(current, total) => getPageRangeText(current, total)}
    page={page}
    pageSizes={pageSizes}
    pageSize={pageSize}
    totalItems={totalItems}
    onChange={(action) => onPageChange(action.page, action.pageSize)}
  />
);

MiqPagination.propTypes = {
  pageOptions: PropTypes.shape({
    totalItems: PropTypes.number,
    page: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
  }),
};

MiqPagination.defaultProps = {
  pageOptions: {
    totalItems: 10,
    page: 1,
    pageSizes: [5, 10, 20, 50, 100, 200],
    pageSize: 20,
  },
};

export default MiqPagination;
