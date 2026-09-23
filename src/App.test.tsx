import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('mock auth flow', () => {
  it('shows seeded demo profiles and supports login for a different mock user', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText(/3 demo profiles/i)).toBeInTheDocument();
    expect(screen.queryByText(/where do you think the most money went/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    await user.type(screen.getByLabelText(/email/i), 'jordan@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('heading', { name: /jordan lee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /jordan/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/account overview/i)).toBeInTheDocument();
    expect(screen.getByText(/where do you think the most money went/i)).toBeInTheDocument();
  });

  it('opens the account creation flow from the landing-page CTA', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /try it today/i }));

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
  });

  it('lets a logged-in user switch personas from the top app bar', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /log in/i }));
    await user.type(screen.getByLabelText(/email/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const alexButton = screen.getByRole('button', { name: /alex/i });
    const jordanButton = screen.getByRole('button', { name: /jordan/i });

    expect(alexButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(jordanButton);

    expect(jordanButton).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByText(/curated for jordan/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /jordan lee/i })).toBeInTheDocument();
  });

  it('allows a mock account login and logout while keeping the homepage visible', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('heading', { name: /alex rivera/i })).toBeInTheDocument();
    expect(screen.getAllByText(/mock profile/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
