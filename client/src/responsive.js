import { css } from 'styled-components';

export const mobile = (styles) => css`
  @media only screen and (max-width: 768px) {
    ${styles};
  }
`;
