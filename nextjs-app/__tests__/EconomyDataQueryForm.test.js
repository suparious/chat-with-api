<<<<<<< HEAD
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
=======
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import axiosMock from 'axios'
import EconomyDataQueryForm from '../components/EconomyDataQueryForm'
import { QueryProvider } from '../context/QueryContext'
import MockAdapter from 'axios-mock-adapter'

describe('EconomyDataQueryForm', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axiosMock)
    render(
      <QueryProvider>
        <EconomyDataQueryForm />
      </QueryProvider>
    )
  })

  it('renders the form', () => {
    expect(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'")).toBeInTheDocument()
  })

  it('submits data and displays results on success', async () => {
    mock.onPost('/api/data/query').reply(200, {
      data: { result: 'The current unemployment rate is 5%' }
    })

    fireEvent.change(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'"), { target: { value: 'What is the current unemployment rate?' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText('Query Result:')).toBeInTheDocument()
      expect(screen.getByText(/The current unemployment rate is 5%/)).toBeInTheDocument()
    })
  })

  it('displays an error message on API call failure', async () => {
    mock.onPost('/api/data/query').networkError()

    fireEvent.change(screen.getByPlaceholderText("e.g., 'What is the current unemployment rate?'"), { target: { value: 'What is the GDP growth?' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data. Please try again.')).toBeInTheDocument()
    })
  })
})
>>>>>>> 551e70b (refactoring)
