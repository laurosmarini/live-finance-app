import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

function Transactions() {
  return (
    <Container>
      <Title>Transactions</Title>
      <p>Transaction management coming soon...</p>
    </Container>
  );
}

export default Transactions;
