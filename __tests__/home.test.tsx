import {expect, test} from 'vitest'
import {render,screen} from '@testing-library/react'
import Home from '@/app/page'

test("Home Page" , async () => {
    const {container} = render(<Home />)
    expect(container).toBeDefined();
})