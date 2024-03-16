import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosMock from 'axios';
import EconomyDataQueryForm from '../components/EconomyDataQueryForm';

jest.mock('axios');

describe('EconomyDataQueryForm', () => {
  it('renders the form', () => {
    render(<EconomyDataQueryForm />);
    expect(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'")).toBeInTheDocument();
  });

  it('submits data and displays results', async () => {
    axiosMock.post.mockResolvedValueOnce({
      data: { result: 'Test Result' }
    });

    render(<EconomyDataQueryForm />);
    fireEvent.change(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'"), { target: { value: 'GDP growth' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Query Result:')).toBeInTheDocument();
      expect(screen.getByText(/Test Result/)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    axiosMock.post.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<EconomyDataQueryForm />);
    fireEvent.change(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'"), { target: { value: 'GDP growth' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data. Please try again.')).toBeInTheDocument();
    });
  });
});