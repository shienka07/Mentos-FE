// src/components/Messages/MessageTable/MessageTable.jsx

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import TableHeaderRow from "./TableHeaderRow";
import MessageRow from "./MessageRow";
import MessageRowMobile from "./MessageRowMobile";
import MessageRowMobileSkeleton from "./MessageRowMobileSkeleton";
import MessageTablePagination from "./MessageTablePagination";
import MessageModal from "../MessageModal";
import { useState, useEffect, useCallback } from "react";
import MessageSkeletonRow from "./MessageSkeletonRow";
import { useMessageStore } from "../../../store/useMessageStore";

export default function MessageTable({
  messages = [],
  loading,
  tab,
  totalItems,
  totalPages,
}) {
  const {
    page,
    setPage,
    selectedMessageIds,
    toggleSelectedMessageId,
    setSelectedMessageIds,
  } = useMessageStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const displayedMessages = messages;
  const isPageFull = displayedMessages.length === 10;

  const isMessageSelected = (id) => selectedMessageIds.includes(id);

  const handleSelect = (messageId) => {
    toggleSelectedMessageId(messageId);
  };

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const handleRowClick = (messageId) => {
    setSelectedMessageId(messageId);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = displayedMessages.map((m) => m.messageId);
      setSelectedMessageIds(newSelected);
    } else {
      setSelectedMessageIds([]);
    }
  };

  useEffect(() => {
    if (!displayedMessages.length) {
      setSelectedMessageIds([]);
    }
  }, [displayedMessages.length]);

  useEffect(() => {
    setSelectedMessageIds([]);
  }, [messages.length]);

  const selectedAll =
    displayedMessages.length > 0 &&
    selectedMessageIds.length === displayedMessages.length;

  return (
    <>
      {/* 모바일은 카드형 UI로 전환 */}
      {isMobile ? (
        <Box
          sx={{
            bgcolor: "var(--bg-100)",
            minHeight: 585,
          }}
        >
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <MessageRowMobileSkeleton key={i} />
            ))
          ) : displayedMessages.length > 0 ? (
            displayedMessages.map((msg) => (
              <MessageRowMobile
                key={msg.messageId}
                messageId={msg.messageId}
                nickname={msg.nickname}
                content={msg.content}
                isRead={msg.isRead}
                createdAt={msg.createdAt}
                isSelected={isMessageSelected(msg.messageId)}
                onSelect={handleSelect}
                onClick={handleRowClick}
              />
            ))
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={300}
              bgcolor="var(--bg-100)"
            >
              <Typography
                color="var(--text-300)"
                fontSize="14px"
                textAlign="center"
              >
                쪽지가 없어요.
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            boxShadow: "none",
            minHeight: 585,
            width: "100%",
            overflowX: "auto",
            bgcolor: "var(--bg-100)",
          }}
        >
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
              bgcolor: "var(--bg-100)",
            }}
          >
            <TableHeaderRow
              tab={tab}
              numSelected={selectedMessageIds.length}
              rowCount={displayedMessages.length}
              onSelectAllClick={handleSelectAllClick}
              selectedAll={selectedAll}
              isMobile={isMobile}
              sx={{ bgcolor: "var(--bg-100)" }}
            />
            <TableBody sx={{ bgcolor: "var(--bg-100)" }}>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <MessageSkeletonRow key={i} />
                ))
              ) : displayedMessages.length > 0 ? (
                displayedMessages.map((msg, i) => (
                  <MessageRow
                    key={msg.messageId}
                    {...msg}
                    onClick={handleRowClick}
                    isLast={i === displayedMessages.length - 1}
                    removeBorder={isPageFull && i === 9}
                    isSelected={isMessageSelected(msg.messageId)}
                    onSelect={handleSelect}
                    isMobile={isMobile}
                  />
                ))
              ) : (
                <TableRow
                  sx={{
                    bgcolor: "var(--bg-100)",
                    "&:hover": { bgcolor: "var(--bg-200)" },
                  }}
                >
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      height: 300,
                      borderBottom: "none",
                      px: 0,
                      py: 0,
                      bgcolor: "var(--bg-100)",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                      width="100%"
                      bgcolor="var(--bg-100)"
                    >
                      <Typography
                        color="var(--text-300)"
                        fontSize="14px"
                        textAlign="center"
                      >
                        쪽지가 없어요.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MessageTablePagination
        page={page}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {selectedMessageId && (
        <MessageModal
          messageId={selectedMessageId}
          tab={tab}
          onClose={() => setSelectedMessageId(null)}
        />
      )}
    </>
  );
}
