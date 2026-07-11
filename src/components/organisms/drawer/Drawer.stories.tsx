import { Button } from '@atoms/button';
import { Input } from '@atoms/input';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useState } from 'react';
import { Drawer } from './Drawer';
import type { DrawerBackdrop, DrawerPlacement, DrawerSize } from './types';

const DrawerExample = ({
  backdrop,
  buttonText = 'Open drawer',
  children,
  closeText = 'Done',
  description = 'Review supporting information without losing the current page context.',
  dismissible,
  placement,
  size,
  title = 'Project details'
}: {
  backdrop?: DrawerBackdrop;
  buttonText?: string;
  children?: ReactNode;
  closeText?: string;
  description?: string;
  dismissible?: boolean;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  title?: string;
}) => (
  <Drawer onOpenChange={action(`${title} open change`)}>
    <Drawer.Trigger asChild={true}>
      <Button
        className='bg-background-light text-brand-light hover:bg-surface-light dark:bg-surface-dark dark:text-brand-dark dark:hover:bg-surface-raised-dark'
        emphasis='flat'
        text={buttonText}
        variant='secondary'
      />
    </Drawer.Trigger>
    <Drawer.Content backdrop={backdrop} dismissible={dismissible} placement={placement} size={size}>
      <Drawer.Header>
        <Drawer.Title>{title}</Drawer.Title>
        <Drawer.Description>{description}</Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>{children ?? <p>Drawer content is placed in the internal scroll region.</p>}</Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close>{closeText}</Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
);

/**
 * ## Description
 * Drawer presents supplemental tasks, navigation, forms, and long content in a Radix Dialog-backed off-canvas layer.
 *
 * ## Dependencies
 * Uses Radix Dialog internally for modal semantics and focus management. These stories use `Button` and `Input` to demonstrate supported trigger, action, and form composition.
 *
 * ## Usage Guide
 * Compose the approved public API only: `Drawer`, `Drawer.Trigger`, `Drawer.Content`, `Drawer.Header`, `Drawer.Title`, `Drawer.Description`, `Drawer.Body`, `Drawer.Footer`, and `Drawer.Close`.
 * `Drawer.Title` is required for an accessible dialog name. `dismissible` controls outside dismissal, while `closeOnEscape` controls Escape-key dismissal.
 */
const meta: Meta<typeof Drawer> = {
  title: 'Organisms/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Drawer>;

/**
 * Shows the default end placement, medium size, opacity backdrop, and accessible title/description anatomy.
 */
export const Default: Story = {
  render: () => <DrawerExample />
};

/**
 * Shows controlled open state owned by the consumer.
 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild={true}>
          <Button text={open ? 'Drawer is open' : 'Open controlled drawer'} variant='secondary' />
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Controlled drawer</Drawer.Title>
            <Drawer.Description>
              The application owns the open state and receives every open-change request.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            Use controlled mode when route state, command palettes, or app workflows own visibility.
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>Close controlled drawer</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    );
  }
};

/**
 * Shows all supported logical placements. `start` and `end` adapt to mobile bottom layout below `md`.
 */
export const Placements: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4 p-6'>
      <DrawerExample buttonText='start' placement='start' title='start drawer' />
      <DrawerExample buttonText='end' placement='end' title='end drawer' />
      <DrawerExample buttonText='top' placement='top' title='top drawer' />
      <DrawerExample buttonText='bottom' placement='bottom' title='bottom drawer' />
    </div>
  )
};

/**
 * Documents the mobile behavior: side placements use an effective bottom sheet below the project `md` breakpoint.
 */
export const ResponsiveMobile: Story = {
  render: () => (
    <DrawerExample
      buttonText='Open mobile-adaptive drawer'
      description='On narrow viewports this side drawer becomes a bottom sheet while preserving the requested logical placement for md and wider viewports.'
      placement='end'
      title='Responsive mobile drawer'
    />
  )
};

/**
 * Documents the mobile safe-area expectation for bottom and mobile-adapted side drawers.
 */
export const MobileSafeArea: Story = {
  render: () => (
    <DrawerExample
      buttonText='Open safe-area drawer'
      description='The footer uses the drawer safe-area utility so explicit close actions remain clear of mobile home indicators.'
      placement='bottom'
      title='Safe-area drawer'
    />
  )
};

/**
 * Shows the supported size scale. Side placements use modal width utilities; block placements use drawer max-height utilities.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4 p-6'>
      <DrawerExample buttonText='XS' size='xs' title='xs drawer' />
      <DrawerExample buttonText='SM' size='sm' title='sm drawer' />
      <DrawerExample buttonText='MD' size='md' title='md drawer' />
      <DrawerExample buttonText='LG' size='lg' title='lg drawer' />
      <DrawerExample buttonText='XL' size='xl' title='xl drawer' />
      <DrawerExample buttonText='FULL' size='full' title='full drawer' />
    </div>
  )
};

/**
 * Shows the approved backdrop variants aligned with Modal overlay conventions.
 */
export const BackdropVariants: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4 p-6'>
      <DrawerExample backdrop='opacity' buttonText='opacity' title='opacity backdrop' />
      <DrawerExample backdrop='blur' buttonText='blur' title='blur backdrop' />
      <DrawerExample backdrop='transparent' buttonText='transparent' title='transparent backdrop' />
    </div>
  )
};

/**
 * Shows outside dismissal disabled while keeping the explicit close path visible.
 */
export const NonDismissible: Story = {
  render: () => (
    <DrawerExample
      buttonText='Open non-dismissible drawer'
      closeText='I understand'
      description='Backdrop and outside interactions stay disabled; the explicit close control remains available.'
      dismissible={false}
      title='Non-dismissible workflow'
    />
  )
};

/**
 * Shows long content inside the internal body scroll region while header and footer remain visible.
 */
export const ScrollableContent: Story = {
  render: () => (
    <Drawer onOpenChange={action('Scrollable content drawer open change')}>
      <Drawer.Trigger asChild={true}>
        <Button emphasis='flat' text='Open long content' variant='secondary' />
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Scrollable content drawer</Drawer.Title>
          <Drawer.Description>
            This uses the same default end placement as the default story while the body content scrolls internally.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <div className='grid gap-3'>
            <p>Section 1: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 2: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 3: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 4: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 5: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 6: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 7: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 8: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 9: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 10: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 11: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
            <p>Section 12: long drawer content scrolls inside `Drawer.Body` rather than moving the header or footer.</p>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>Cancel</Drawer.Close>
          <Button onClick={action('Scrollable content save click')} text='Save changes' />
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
};

/**
 * Shows custom header, body, and footer composition with only public Drawer slots.
 */
export const CustomHeaderBodyFooter: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild={true}>
        <Button text='Open custom layout' variant='secondary' />
      </Drawer.Trigger>
      <Drawer.Content size='lg'>
        <Drawer.Header className='bg-surface-raised-light dark:bg-surface-raised-dark'>
          <Drawer.Title>Custom layout drawer</Drawer.Title>
          <Drawer.Description>
            Slots accept layout classes without exposing Portal, Overlay, or Backdrop APIs.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className='grid gap-4'>
          <div className='rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
            Custom body content can combine cards, summaries, and status messages.
          </div>
        </Drawer.Body>
        <Drawer.Footer className='justify-between'>
          <span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>Autosaved</span>
          <Drawer.Close>Finish</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
};

/**
 * Shows form content with visible labels and explicit submit/cancel actions.
 */
export const FormDrawer: Story = {
  render: () => (
    <DrawerExample buttonText='Edit project' size='lg' title='Edit project'>
      <form className='grid gap-4' onSubmit={action('drawer form submit')}>
        <Input id='drawer-project-name' isFullWidth={true} label='Project name' placeholder='Stack-and-Flow' />
        <Input id='drawer-project-owner' isFullWidth={true} label='Owner' placeholder='Design Systems' />
        <Button onClick={action('drawer save click')} text='Save changes' type='submit' />
      </form>
    </DrawerExample>
  )
};

/**
 * Shows navigation content using drawer semantics for mobile or secondary navigation.
 */
export const NavigationDrawer: Story = {
  render: () => (
    <DrawerExample buttonText='Open navigation' placement='start' title='Navigation drawer'>
      <nav aria-label='Drawer navigation' className='grid gap-2'>
        <a
          className='rounded-md px-4 py-3 text-text-secondary-light no-underline hover:bg-black-tint-low hover:text-text-light dark:text-text-secondary-dark dark:hover:bg-white-tint-faint dark:hover:text-text-dark'
          href='#'
        >
          Overview
        </a>
        <a
          className='rounded-md px-4 py-3 text-text-secondary-light no-underline hover:bg-black-tint-low hover:text-text-light dark:text-text-secondary-dark dark:hover:bg-white-tint-faint dark:hover:text-text-dark'
          href='#'
        >
          Tokens
        </a>
        <a
          className='rounded-md px-4 py-3 text-text-secondary-light no-underline hover:bg-black-tint-low hover:text-text-light dark:text-text-secondary-dark dark:hover:bg-white-tint-faint dark:hover:text-text-dark'
          href='#'
        >
          Components
        </a>
        <a
          className='rounded-md px-4 py-3 text-text-secondary-light no-underline hover:bg-black-tint-low hover:text-text-light dark:text-text-secondary-dark dark:hover:bg-white-tint-faint dark:hover:text-text-dark'
          href='#'
        >
          Patterns
        </a>
      </nav>
    </DrawerExample>
  )
};

/**
 * Documents reduced-motion expectations: overlay fade and panel slide are removed by the shared `motion-reduce` seams.
 */
export const ReducedMotionNotes: Story = {
  render: () => (
    <DrawerExample
      buttonText='Open reduced-motion drawer'
      description='When users prefer reduced motion, drawer animations are suppressed through motion-reduce utilities while dialog behavior remains unchanged.'
      title='Reduced-motion drawer'
    />
  )
};

/**
 * Documents RTL behavior: logical `start` maps to the right side on md and wider viewports, while mobile still adapts to bottom.
 */
export const RTL: Story = {
  render: () => (
    <div dir='rtl'>
      <DrawerExample
        buttonText='فتح الدرج'
        description='Logical placement seams preserve RTL start/end behavior without changing the public API.'
        placement='start'
        title='RTL logical drawer'
      />
    </div>
  )
};
