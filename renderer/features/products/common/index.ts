export const getTextFromStatus = (status: string) => {
  switch (status) {
    case 'success':
      return 'Success';
    case 'failure':
      return 'Failure';
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    default:
      return 'No Status';
  }
};

export const getColorFromStatus = (status: string) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'failure':
      return 'failure';
    case 'pending':
      return 'warning';
    case 'processing':
      return 'indigo';
    default:
      return 'info';
  }
};
