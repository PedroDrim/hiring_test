/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, expect, beforeEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import InstructionsModal from "./InstructionsModal"


describe("InstructionsModal", () => {

    beforeEach(() => {
        cleanup()
    })

    it("1.1. Must be able to open the modal and read the instructions", () => {
        const defaultProps = {
            isOpen: true,
            onRequestClose: vi.fn(),
            isCalmMode: false,
            playClickSound: vi.fn(),
        }

        render(<InstructionsModal {...defaultProps} />)
        expect(screen.getByText("Game Instructions")).not.toBeNull()
    })

    it("1.2. Must be able to close the modal correctly", () => {
        const defaultProps = {
            isOpen: true,
            onRequestClose: vi.fn(),
            isCalmMode: false,
            playClickSound: vi.fn(),
        }

        render(<InstructionsModal {...defaultProps} />)

        const closeButton = screen.getByRole("button")
        fireEvent.click(closeButton)

        expect(defaultProps.onRequestClose).toHaveBeenCalledOnce()
        expect(defaultProps.playClickSound).toHaveBeenCalledOnce()
    })
})
