import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[100]} 0%, ${({ theme }) => theme.colors.primary[50]} 100%);
  padding: ${({ theme }) => theme.space[4]};
`;

const FormCard = styled.div`
  background: white;
  padding: ${({ theme }) => theme.space[8]};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

function Register() {
  return (
    <Container>
      <FormCard>
        <h1>Register</h1>
        <p>Registration form coming soon...</p>
      </FormCard>
    </Container>
  );
}

export default Register;
