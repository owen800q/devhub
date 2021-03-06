import React, { useState } from 'react'

import { getColumnHeaderDetails } from '@devhub/core/src/utils/helpers/github/events'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptions } from './ColumnOptions'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export function NotificationColumn(props: NotificationColumnProps) {
  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const { column, columnIndex, pagingEnabled, subscriptions } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <Column
      key={`notification-column-${column.id}-inner`}
      columnId={column.id}
      pagingEnabled={pagingEnabled}
    >
      <ColumnHeader>
        <ColumnHeaderItem
          analyticsLabel={undefined}
          fixedIconSize
          iconName={requestTypeIconAndData.icon}
          style={{ flex: 1 }}
          subtitle={requestTypeIconAndData.subtitle}
          title={requestTypeIconAndData.title}
        />

        <ColumnHeaderItem
          analyticsLabel="clear_column"
          disabled={
            column.filters &&
            column.filters.inbox &&
            column.filters.inbox &&
            column.filters.inbox.archived === true
          }
          iconName="circle-slash"
          onPress={() =>
            setColumnClearedAtFilter({
              columnId: column.id,
              clearedAt: new Date().toISOString(),
            })
          }
        />
        <ColumnHeaderItem
          analyticsAction={showColumnOptions ? 'hide' : 'show'}
          analyticsLabel="column_options"
          iconName="settings"
          onPress={() => setShowColumnOptions(!showColumnOptions)}
        />
      </ColumnHeader>

      {!!showColumnOptions && (
        <ColumnOptions column={column} columnIndex={columnIndex} />
      )}

      <NotificationCardsContainer
        key={`notification-cards-container-${column.id}`}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        {...props}
      />
    </Column>
  )
}
