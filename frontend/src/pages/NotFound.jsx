import React from 'react';
import styled from 'styled-components';
import GlobalStyle from '../components/common/GlobalStyle';

const ErrorAlert = styled.div`
  height: 100vh;
  font-size: 100px;
  font-weight: bolder;
  font-family: 'MaplestoryOTFBold';
  font-weight: bolder;
  color: white;
  background-color: #2b2b2b;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function NotFound() {
  return (
    <>
      <GlobalStyle />
      <ErrorAlert>NotFound</ErrorAlert>
    </>
  );
}
