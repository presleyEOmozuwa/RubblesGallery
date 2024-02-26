import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import Wrapper from '../../../common/Wrapper';
import LayoutPublic from '../../components/navbars/NavbarPublic';
import userEvent from '@testing-library/user-event';

describe('Register.js', () => {
    let component;
    beforeEach(() => {
        component = render(
            <Wrapper>
                <MemoryRouter initialIndex={0} initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<LayoutPublic />} />
                        <Route path="/register" element={<RegisterForm/>} />
                    </Routes>
                </MemoryRouter>
            </Wrapper>
        );
    })

    it('should navigate and render sign up page when the register link is clicked on the home page', async () => {
        const { getByRole, findByTestId } = component;
        
        userEvent.click(getByRole("link", { name: "Register"}));
        
        expect(await findByTestId("username element")).toBeInTheDocument();
    });
})

