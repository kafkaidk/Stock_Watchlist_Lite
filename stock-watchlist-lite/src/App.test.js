import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.setTimeout(10000);

describe('Stock Watchlist App', () => {
  test('renders stock cards with correct fields', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-grid')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    const stockCards = screen.getAllByTestId('stock-card');
    expect(stockCards.length).toBeGreaterThan(0);
    
    const firstCard = stockCards[0];
    expect(firstCard).toHaveTextContent('RELIANCE');
    expect(firstCard.querySelector('[data-testid="capital-price"]')).toBeInTheDocument();
  });

  test('toggle correctly switches between View A and View B', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-grid')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    const toggleButton = screen.getAllByTestId('toggle-view')[0];
    const initialText = toggleButton.textContent;
    
    fireEvent.click(toggleButton);
    expect(toggleButton.textContent).not.toBe(initialText);
  });

  test('error state displays correctly', async () => {
    const originalRandom = Math.random;
    Math.random = jest.fn(() => 0.05);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load stocks')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    Math.random = originalRandom;
  });
});