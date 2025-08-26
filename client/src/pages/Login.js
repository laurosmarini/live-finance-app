import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[700]};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your Finance App account</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <FooterText>
          Don't have an account?{' '}
          <StyledLink to="/register">Create one here</StyledLink>
        </FooterText>
      </FormCard>
    </Container>
  );
}

export default Login;
