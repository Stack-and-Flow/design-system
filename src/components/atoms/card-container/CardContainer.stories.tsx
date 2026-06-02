import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Text } from '../text';
import { CardContainer } from './CardContainer';

/**
 * ## Description
 * CardContainer renders a quiet, token-backed surface for grouping related content without owning its internal layout.
 *
 * ## Dependencies
 * Uses `Text` for copy examples and `Button` for nested interactive children inside the card body.
 *
 * ## Usage Guide
 * Use CardContainer as a presentational wrapper for content blocks, settings panels, summaries, and feature highlights. Keep the root non-interactive by default and place links or buttons inside the card when actions are needed. Leave `backdropBlur="none"` for normal document-flow cards; use backdropBlur levels only when the card is intentionally acting as a floating/glass surface above other content.
 */
const meta: Meta<typeof CardContainer> = {
  title: 'Atoms/CardContainer',
  component: CardContainer,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof CardContainer>;

const renderCardBody = (title: string, description: string) => (
  <div className='grid gap-3'>
    <h3 className='fs-h6 font-weight-bold text-text-light dark:text-text-dark'>{title}</h3>
    <Text className='text-text-secondary-light dark:text-text-secondary-dark'>{description}</Text>
  </div>
);

/**
 * Shows the default card surface using the component default variants.
 */
export const Default: Story = {
  args: {
    children: renderCardBody('Usage summary', 'Group related content inside a quiet surface with native div semantics.')
  }
};

/**
 * Shows the four approved surface variants.
 */
export const Variants: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <CardContainer variant='surface'>
        {renderCardBody('Surface', 'Each variant adjusts surface depth without changing the free-form content model.')}
      </CardContainer>
      <CardContainer variant='raised'>
        {renderCardBody('Raised', 'Each variant adjusts surface depth without changing the free-form content model.')}
      </CardContainer>
      <CardContainer variant='outlined'>
        {renderCardBody('Outlined', 'Each variant adjusts surface depth without changing the free-form content model.')}
      </CardContainer>
      <CardContainer variant='tinted'>
        {renderCardBody('Tinted', 'Each variant adjusts surface depth without changing the free-form content model.')}
      </CardContainer>
    </div>
  )
};

/**
 * Shows the internal spacing scale from none to large.
 */
export const Padding: Story = {
  render: () => (
    <div className='grid gap-4'>
      <CardContainer padding='none'>
        {renderCardBody('Padding none', 'Use the spacing scale to match the density of the parent layout.')}
      </CardContainer>
      <CardContainer padding='sm'>
        {renderCardBody('Padding sm', 'Use the spacing scale to match the density of the parent layout.')}
      </CardContainer>
      <CardContainer padding='md'>
        {renderCardBody('Padding md', 'Use the spacing scale to match the density of the parent layout.')}
      </CardContainer>
      <CardContainer padding='lg'>
        {renderCardBody('Padding lg', 'Use the spacing scale to match the density of the parent layout.')}
      </CardContainer>
    </div>
  )
};

/**
 * Shows the approved radius options from square to large.
 */
export const Radius: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <CardContainer radius='none'>
        {renderCardBody('Radius none', 'Radius changes the card silhouette while preserving the same content flow.')}
      </CardContainer>
      <CardContainer radius='xs'>
        {renderCardBody('Radius xs', 'Radius changes the card silhouette while preserving the same content flow.')}
      </CardContainer>
      <CardContainer radius='sm'>
        {renderCardBody('Radius sm', 'Radius changes the card silhouette while preserving the same content flow.')}
      </CardContainer>
      <CardContainer radius='md'>
        {renderCardBody('Radius md', 'Radius changes the card silhouette while preserving the same content flow.')}
      </CardContainer>
      <CardContainer radius='lg'>
        {renderCardBody('Radius lg', 'Radius changes the card silhouette while preserving the same content flow.')}
      </CardContainer>
    </div>
  )
};

/**
 * Shows decorative hover lift without implying root interactivity.
 */
export const HoverEffects: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <CardContainer hoverEffect='none'>
        <div className='grid gap-3'>
          <h3 className='fs-h6 font-weight-bold text-text-light dark:text-text-dark'>Hover none</h3>
          <Text className='text-text-secondary-light dark:text-text-secondary-dark'>
            The default card stays still and keeps a quiet surface treatment.
          </Text>
        </div>
      </CardContainer>
      <CardContainer hoverEffect='lift' variant='raised'>
        <div className='grid gap-3'>
          <h3 className='fs-h6 font-weight-bold text-text-light dark:text-text-dark'>Hover lift</h3>
          <Text className='text-text-secondary-light dark:text-text-secondary-dark'>
            Lift is a subtle 2px decorative movement. It does not make the card keyboard-focusable or clickable.
          </Text>
        </div>
      </CardContainer>
    </div>
  )
};

/**
 * Shows the renamed backdropBlur prop across the three approved blur levels over one plain gray background block.
 */
export const BackdropBlur: Story = {
  render: () => (
    <div className='relative isolate overflow-hidden rounded-lg p-lg'>
      <div className='pointer-events-none absolute inset-x-0 top-24 h-32 bg-[#9ca3af]' />
      <div className='relative grid gap-4 md:grid-cols-3'>
        <CardContainer backdropBlur='sm' hoverEffect='lift' radius='lg' padding='lg'>
          {renderCardBody('backdropBlur=sm', 'A subtle blur over the plain gray background block.')}
        </CardContainer>
        <CardContainer backdropBlur='md' hoverEffect='lift' radius='lg' padding='lg'>
          {renderCardBody('backdropBlur=md', 'The default blur level softens the gray block more clearly.')}
        </CardContainer>
        <CardContainer backdropBlur='lg' hoverEffect='lift' radius='lg' padding='lg'>
          {renderCardBody('backdropBlur=lg', 'The strongest blur creates the softest edge over the block.')}
        </CardContainer>
      </div>
    </div>
  )
};

/**
 * Shows semantic article markup provided by the consumer.
 */
export const SemanticArticle: Story = {
  render: () => (
    <CardContainer role='article' aria-labelledby='billing-card-title'>
      <div className='grid gap-3'>
        <h3 id='billing-card-title' className='fs-h6 font-weight-bold text-text-light dark:text-text-dark'>
          Billing
        </h3>
        <Text className='text-text-secondary-light dark:text-text-secondary-dark'>
          Manage invoices, payment methods, and tax details from a single surface.
        </Text>
      </div>
    </CardContainer>
  )
};

/**
 * Shows nested design-system content while keeping actions inside the card body.
 */
export const NestedContent: Story = {
  render: () => (
    <CardContainer variant='raised' hoverEffect='lift'>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <h3 className='fs-h6 font-weight-bold text-text-light dark:text-text-dark'>Team workspace</h3>
          <Text className='text-text-secondary-light dark:text-text-secondary-dark'>
            Invite collaborators, review permissions, and manage shared environments from one place.
          </Text>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button text='Open workspace' onClick={action('open-workspace-click')} />
          <Button text='Learn more' variant='ghost' onClick={action('learn-more-click')} />
        </div>
      </div>
    </CardContainer>
  )
};
